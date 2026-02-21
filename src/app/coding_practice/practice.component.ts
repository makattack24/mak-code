import {
	Component,
	ViewChild,
	ElementRef,
	AfterViewInit,
	HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Problem, TestCase } from './models/problem.model';
import { PROBLEMS } from './data/problems';

interface TestResult {
	input: string;
	expected: string;
	actual: string;
	passed: boolean;
}

@Component({
	selector: 'app-practice',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './practice.component.html',
	styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements AfterViewInit {
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

	// ── Test state ──
	testResults: TestResult[] = [];
	allPassed = false;
	activeTab: 'description' | 'results' = 'description';

	// ── Solved tracking (sessionStorage) ──
	solvedIds = new Set<number>();

	// ── Panel resizing ──
	leftPanelWidth = 45; // percentage
	isResizing = false;

	@ViewChild('editorTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

	get lineNumbers(): number[] {
		return Array(this.code.split('\n').length)
			.fill(0)
			.map((_, i) => i + 1);
	}

	get passedCount(): number {
		return this.testResults.filter((r) => r.passed).length;
	}

	get totalTests(): number {
		return this.testResults.length;
	}

	constructor() {
		const cats = new Set(this.problems.map((p) => p.category));
		this.categories = ['All', ...Array.from(cats).sort()];

		// Restore solved problems from sessionStorage
		try {
			const saved = sessionStorage.getItem('practice_solved');
			if (saved) {
				this.solvedIds = new Set(JSON.parse(saved));
			}
		} catch {}
	}

	ngAfterViewInit() {
		this.autoResize();
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
		setTimeout(() => this.autoResize(), 0);
	}

	goBackToList() {
		this.selectedProblem = null;
		this.code = '';
		this.output = '';
		this.error = '';
		this.testResults = [];
		this.allPassed = false;
	}

	resetCode() {
		if (this.selectedProblem) {
			this.code = this.selectedProblem.starterCode;
			this.output = '';
			this.error = '';
			this.testResults = [];
			this.allPassed = false;
			setTimeout(() => this.autoResize(), 0);
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

	// ── Editor helpers ──
	autoResize() {
		if (this.textarea) {
			const ta = this.textarea.nativeElement;
			ta.style.height = 'auto';
			ta.style.height = ta.scrollHeight + 'px';
		}
	}

	onInput() {
		this.autoResize();
	}

	highlightLine(lineIndex: number) {
		const lines = this.code.split('\n');
		let start = 0;
		for (let i = 0; i < lineIndex; i++) {
			start += lines[i].length + 1;
		}
		const end = start + lines[lineIndex].length;
		const textarea = this.textarea?.nativeElement;
		if (textarea) {
			textarea.focus();
			textarea.setSelectionRange(start, end);
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
						this.solvedIds.add(this.selectedProblem.id);
						try {
							sessionStorage.setItem(
								'practice_solved',
								JSON.stringify(Array.from(this.solvedIds))
							);
						} catch {}
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

	// ── Helpers ──
	getDifficultyClass(diff: string): string {
		return 'diff-' + diff.toLowerCase();
	}

	isSolved(id: number): boolean {
		return this.solvedIds.has(id);
	}

	formatDescription(text: string): string {
		// Basic markdown-ish rendering: bold, inline code, line breaks
		return text
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/`(.*?)`/g, '<code>$1</code>')
			.replace(/\n/g, '<br>');
	}
}
