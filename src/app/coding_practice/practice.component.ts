import {
	Component,
	ViewChild,
	ElementRef,
	AfterViewInit,
	OnInit,
	OnDestroy,
	HostListener,
	NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Problem, TestCase } from './models/problem.model';
import { PROBLEMS } from './data/problems';
import { AuthService } from '../services/auth.service';
import {
	PracticeStatsService,
	UserPracticeStats,
	ProblemStats,
	RecentAttempt,
} from '../services/practice-stats.service';
import { ModalComponent } from '../shared/modal/modal.component';

declare const monaco: any;

interface TestResult {
	input: string;
	expected: string;
	actual: string;
	passed: boolean;
}

const COIN_REWARDS: Record<string, number> = {
	Easy: 10,
	Medium: 25,
	Hard: 50,
};

@Component({
	selector: 'app-practice',
	standalone: true,
	imports: [CommonModule, FormsModule, ModalComponent],
	templateUrl: './practice.component.html',
	styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements AfterViewInit, OnInit, OnDestroy {
	// ── Problem list state ──
	problems: Problem[] = PROBLEMS;
	filteredProblems: Problem[] = PROBLEMS;
	selectedProblem: Problem | null = null;
	searchQuery = '';
	activeCategory = 'All';
	activeDifficulty = 'All';
	categories: string[] = [];
	showHints = false;
	revealedHints = 0;

	// ── Editor state ──
	code = '';
	output = '';
	error = '';
	isRunning = false;

	// ── Monaco editor ──
	private monacoEditor: any;
	private monacoLoaded = false;
	@ViewChild('monacoContainer') monacoContainer!: ElementRef<HTMLDivElement>;

	// ── Test state ──
	testResults: TestResult[] = [];
	allPassed = false;
	activeTab: 'description' | 'results' = 'description';

	// ── Solved tracking (sessionStorage + DB) ──
	solvedIds = new Set<number>();

	// ── Stats ──
	stats: UserPracticeStats | null = null;
	showStats = false;

	// ── Code viewer modal ──
	showCodeViewer = false;
	codeViewerTitle = '';
	codeViewerCode = '';

	// ── Coin reward ──
	coinReward: { amount: number; show: boolean } = { amount: 0, show: false };
	private coinRewardTimeout: any = null;

	// ── Panel resizing ──
	leftPanelWidth = 45; // percentage
	isResizing = false;

	// ── Theme observer ──
	private themeObserver: MutationObserver | null = null;

	get passedCount(): number {
		return this.testResults.filter((r) => r.passed).length;
	}

	get totalTests(): number {
		return this.testResults.length;
	}

	/** Total coins earned from all solved problems. */
	get totalCoins(): number {
		if (!this.stats) return 0;
		return this.stats.perProblem
			.filter((p) => p.solved)
			.reduce((sum, p) => {
				const problem = this.problems.find((pr) => pr.id === p.problem_id);
				if (!problem) return sum;
				return sum + (COIN_REWARDS[problem.difficulty] ?? 0);
			}, 0);
	}

	/** Coins for a given difficulty level. */
	getCoinsForDifficulty(difficulty: string): number {
		return COIN_REWARDS[difficulty] ?? 0;
	}

	/** Show a coin reward popup, auto-dismiss after 3s. */
	private showCoinReward(amount: number) {
		if (this.coinRewardTimeout) {
			clearTimeout(this.coinRewardTimeout);
		}
		this.coinReward = { amount, show: true };
		this.coinRewardTimeout = setTimeout(() => {
			this.coinReward = { amount: 0, show: false };
			this.coinRewardTimeout = null;
		}, 3500);
	}

	constructor(
		public authService: AuthService,
		private practiceStats: PracticeStatsService,
		private ngZone: NgZone
	) {
		const cats = new Set(this.problems.map((p) => p.category));
		this.categories = ['All', ...Array.from(cats).sort()];

		// Restore solved problems from sessionStorage as fallback
		try {
			const saved = sessionStorage.getItem('practice_solved');
			if (saved) {
				this.solvedIds = new Set(JSON.parse(saved));
			}
		} catch {}
	}

	ngOnInit() {
		// If logged in, load stats from DB and merge solved IDs
		const user = this.authService.currentUser;
		if (user) {
			this.practiceStats.loadStats(user.id).subscribe((stats) => {
				if (stats) {
					this.stats = stats;
					// Merge DB-solved problems into local set
					stats.perProblem
						.filter((p) => p.solved)
						.forEach((p) => this.solvedIds.add(p.problem_id));
				}
			});
		}
	}

	ngAfterViewInit() {
		this.loadMonaco();
	}

	ngOnDestroy() {
		this.disposeEditor();
		if (this.themeObserver) {
			this.themeObserver.disconnect();
			this.themeObserver = null;
		}
	}

	/** Load Monaco editor scripts dynamically */
	private loadMonaco() {
		if (this.monacoLoaded) {
			this.initEditor();
			return;
		}

		const onGotAmdLoader = () => {
			(window as any).require.config({
				paths: { vs: 'assets/monaco-editor/min/vs' },
			});
			(window as any).require(['vs/editor/editor.main'], () => {
				this.monacoLoaded = true;
				this.ngZone.run(() => this.initEditor());
			});
		};

		if ((window as any).require) {
			onGotAmdLoader();
			return;
		}

		const script = document.createElement('script');
		script.src = 'assets/monaco-editor/min/vs/loader.js';
		script.onload = onGotAmdLoader;
		document.body.appendChild(script);
	}

	/** Initialize the Monaco editor instance */
	private initEditor() {
		if (!this.monacoContainer?.nativeElement) return;

		const currentTheme = document.documentElement.getAttribute('data-theme');
		const monacoTheme = currentTheme === 'light' ? 'vs' : 'vs-dark';

		this.monacoEditor = monaco.editor.create(this.monacoContainer.nativeElement, {
			value: this.code || '',
			language: 'javascript',
			theme: monacoTheme,
			automaticLayout: true,
			minimap: { enabled: false },
			fontSize: 14,
			fontFamily: '"JetBrains Mono", "Fira Mono", "Consolas", "Menlo", monospace',
			lineNumbers: 'on',
			scrollBeyondLastLine: false,
			tabSize: 2,
			wordWrap: 'on',
			padding: { top: 8, bottom: 8 },
			renderLineHighlight: 'line',
			bracketPairColorization: { enabled: true },
			suggest: { showKeywords: true, showSnippets: true },
			parameterHints: { enabled: true },
			folding: true,
			matchBrackets: 'always',
			formatOnPaste: true,
			formatOnType: true,
		});

		// Sync editor content back to our code property
		this.monacoEditor.onDidChangeModelContent(() => {
			this.ngZone.run(() => {
				this.code = this.monacoEditor.getValue();
			});
		});

		// Add keyboard shortcuts
		this.monacoEditor.addAction({
			id: 'run-tests',
			label: 'Submit Tests',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
			run: () => this.ngZone.run(() => this.runTests()),
		});

		this.monacoEditor.addAction({
			id: 'run-code',
			label: 'Run Code',
			keybindings: [monaco.KeyCode.F5],
			run: () => this.ngZone.run(() => this.runCode()),
		});

		// Watch for theme changes
		this.themeObserver = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.attributeName === 'data-theme') {
					const theme = document.documentElement.getAttribute('data-theme');
					monaco.editor.setTheme(theme === 'light' ? 'vs' : 'vs-dark');
				}
			}
		});
		this.themeObserver.observe(document.documentElement, { attributes: true });
	}

	/** Dispose the current Monaco editor instance */
	private disposeEditor() {
		if (this.monacoEditor) {
			this.monacoEditor.dispose();
			this.monacoEditor = null;
		}
	}

	// ── Keyboard shortcuts ──
	@HostListener('document:keydown', ['$event'])
	handleKeyboardShortcut(event: KeyboardEvent) {
		if (!this.selectedProblem) return;
		if (event.ctrlKey && event.key === 'Enter') {
			event.preventDefault();
			this.runTests();
		}
		if (event.key === 'F5') {
			event.preventDefault();
			this.runCode();
		}
	}

	// ── Filtering ──
	filterProblems() {
		this.filteredProblems = this.problems.filter((p) => {
			const matchCategory = this.activeCategory === 'All' || p.category === this.activeCategory;
			const matchDifficulty = this.activeDifficulty === 'All' || p.difficulty === this.activeDifficulty;
			const matchSearch =
				!this.searchQuery ||
				p.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
				p.category.toLowerCase().includes(this.searchQuery.toLowerCase());
			return matchCategory && matchDifficulty && matchSearch;
		});
	}

	selectCategory(cat: string) {
		this.activeCategory = cat;
		this.filterProblems();
	}

	selectDifficulty(diff: string) {
		this.activeDifficulty = diff;
		this.filterProblems();
	}

	onSearchChange() {
		this.filterProblems();
	}

	// ── Problem selection ──
	selectProblem(problem: Problem) {
		this.selectedProblem = problem;
		this.code = problem.starterCode;
		this.output = '';
		this.error = '';
		this.testResults = [];
		this.allPassed = false;
		this.activeTab = 'description';
		this.showHints = false;
		this.revealedHints = 0;

		// Give Angular a tick to render the container, then init or update editor
		setTimeout(() => {
			if (this.monacoEditor) {
				this.monacoEditor.setValue(this.code);
			} else {
				this.loadMonaco();
			}
		}, 0);
	}

	goBackToList() {
		this.selectedProblem = null;
		this.code = '';
		this.output = '';
		this.error = '';
		this.testResults = [];
		this.allPassed = false;
		this.disposeEditor();
	}

	resetCode() {
		if (this.selectedProblem) {
			this.code = this.selectedProblem.starterCode;
			this.output = '';
			this.error = '';
			this.testResults = [];
			this.allPassed = false;
			if (this.monacoEditor) {
				this.monacoEditor.setValue(this.code);
			}
		}
	}

	// ── Hints ──
	toggleHints() {
		this.showHints = !this.showHints;
		if (this.showHints && this.revealedHints === 0) {
			this.revealedHints = 1;
		}
	}

	revealNextHint() {
		if (this.selectedProblem?.hints && this.revealedHints < this.selectedProblem.hints.length) {
			this.revealedHints++;
		}
	}

	// ── Run code (freeform, like editor) ──
	runCode() {
		this.output = '';
		this.error = '';
		this.isRunning = true;
		this.runInSandbox(this.code, (logs, err) => {
			this.output = logs;
			this.error = err;
			this.isRunning = false;
		});
	}

	// ── Run all test cases ──
	runTests() {
		if (!this.selectedProblem) return;
		this.isRunning = true;
		this.testResults = [];
		this.allPassed = false;
		this.error = '';
		this.output = '';
		this.activeTab = 'results';

		const tests = this.selectedProblem.testCases;
		let completed = 0;
		const results: TestResult[] = new Array(tests.length);

		tests.forEach((tc, idx) => {
			const testCode = `
${this.code}

// Run test
const __result = ${tc.input};
console.log(JSON.stringify(__result));
`;

			this.runInSandbox(testCode, (logs, err) => {
				const actual = logs.trim();
				const expected = tc.expected;
				results[idx] = {
					input: tc.input,
					expected,
					actual: err ? `Error: ${err}` : actual,
					passed: !err && actual === expected,
				};
				completed++;
				if (completed === tests.length) {
					this.testResults = results;
					this.allPassed = results.every((r) => r.passed);
					this.isRunning = false;

						if (this.allPassed && this.selectedProblem) {
						const wasAlreadySolved = this.isSolved(this.selectedProblem.id);
						this.solvedIds.add(this.selectedProblem.id);
						try {
							sessionStorage.setItem(
								'practice_solved',
								JSON.stringify(Array.from(this.solvedIds))
							);
						} catch {}

						// Award coins on first solve
						if (!wasAlreadySolved) {
							const reward = this.getCoinsForDifficulty(this.selectedProblem.difficulty);
							this.showCoinReward(reward);
						}
					}

					// Record attempt in DB if logged in
					const user = this.authService.currentUser;
					if (user && this.selectedProblem) {
						this.practiceStats
							.recordAttempt(user.id, this.selectedProblem.id, this.allPassed, this.code)
							.subscribe((stats) => {
								if (this.practiceStats.currentStats) {
									this.stats = this.practiceStats.currentStats;
								}
							});
					}
				}
			});
		});
	}

	// ── Sandboxed code execution (reused from EditorComponent) ──
	private runInSandbox(code: string, callback: (logs: string, error: string) => void) {
		const iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.sandbox.add('allow-scripts');
		document.body.appendChild(iframe);

		let logs: string[] = [];
		let errorMsg = '';
		let done = false;

		const timeout = setTimeout(() => {
			if (!done) {
				done = true;
				window.removeEventListener('message', onMessage);
				try { document.body.removeChild(iframe); } catch {}
				callback(logs.join('\n'), 'Execution timed out (5s limit)');
			}
		}, 5000);

		const script = `
			window.onerror = function(msg) {
				parent.postMessage({ type: 'error', error: msg }, '*');
				parent.postMessage({ type: 'done' }, '*');
			};
			const log = [];
			console.log = function(...args) {
				log.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
				parent.postMessage({ type: 'log', log: log.join('\\n') }, '*');
			};
			try {
				${code}
				parent.postMessage({ type: 'done' }, '*');
			} catch (e) {
				parent.postMessage({ type: 'error', error: e.message }, '*');
				parent.postMessage({ type: 'done' }, '*');
			}
		`;

		iframe.srcdoc = `<script>${script}<\/script>`;

		const onMessage = (event: MessageEvent) => {
			if (event.source !== iframe.contentWindow) return;
			if (event.data.type === 'log') {
				logs = event.data.log.split('\n');
			}
			if (event.data.type === 'error') {
				errorMsg = event.data.error;
			}
			if (event.data.type === 'done') {
				done = true;
				clearTimeout(timeout);
				window.removeEventListener('message', onMessage);
				try { document.body.removeChild(iframe); } catch {}
				callback(logs.join('\n'), errorMsg);
			}
		};

		window.addEventListener('message', onMessage);
	}

	// ── Panel Resizing ──
	onResizeStart(event: MouseEvent) {
		event.preventDefault();
		this.isResizing = true;
	}

	@HostListener('document:mousemove', ['$event'])
	onResizeMove(event: MouseEvent) {
		if (!this.isResizing) return;
		const container = document.querySelector('.practice-workspace') as HTMLElement;
		if (!container) return;
		const rect = container.getBoundingClientRect();
		let pct = ((event.clientX - rect.left) / rect.width) * 100;
		pct = Math.max(25, Math.min(75, pct));
		this.leftPanelWidth = pct;
	}

	@HostListener('document:mouseup')
	onResizeEnd() {
		this.isResizing = false;
	}

	// ── Stats helpers ──
	toggleStats() {
		this.showStats = !this.showStats;
	}

	get successRate(): number {
		if (!this.stats || this.stats.overall.total_attempts === 0) return 0;
		return Math.round(
			(this.stats.overall.total_passed / this.stats.overall.total_attempts) * 100
		);
	}

	getProblemAttempts(problemId: number): number {
		return this.practiceStats.getProblemStats(problemId)?.attempts ?? 0;
	}

	getProblemPasses(problemId: number): number {
		return this.practiceStats.getProblemStats(problemId)?.passes ?? 0;
	}

	// ── Helpers ──
	getDifficultyClass(diff: string): string {
		return 'diff-' + diff.toLowerCase();
	}

	isSolved(id: number): boolean {
		return this.solvedIds.has(id) || this.practiceStats.isProblemSolved(id);
	}

	// ── Code viewer ──
	viewAttemptCode(attempt: RecentAttempt) {
		if (!attempt.code) return;
		const problem = this.problems.find(p => p.id === attempt.problem_id);
		const title = problem
			? `Problem ${attempt.problem_id}: ${problem.title}`
			: `Problem ${attempt.problem_id}`;
		this.codeViewerTitle = title;
		this.codeViewerCode = attempt.code;
		this.showCodeViewer = true;
	}

	closeCodeViewer() {
		this.showCodeViewer = false;
		this.codeViewerTitle = '';
		this.codeViewerCode = '';
	}

	formatDescription(text: string): string {
		// Basic markdown-ish rendering: bold, inline code, line breaks
		return text
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/`(.*?)`/g, '<code>$1</code>')
			.replace(/\n/g, '<br>');
	}
}
