import {
	Component,
	ViewChild,
	ElementRef,
	AfterViewInit,
	OnDestroy,
	NgZone,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare const monaco: any;

@Component({
	selector: 'app-editor',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './editor.component.html',
	styleUrl: './editor.component.scss',
})
export class EditorComponent implements AfterViewInit, OnDestroy {
	code: string = `// Define your function\nfunction add(a, b) {\n  return a + b;\n}\n\n// Test cases\nconsole.log(add(2, 3)); // 5\nconsole.log(add(-1, 1)); // 0`;
	output: string = '';
	error: string = '';

	// ── Monaco editor ──
	private monacoEditor: any;
	private monacoLoaded = false;
	private themeObserver: MutationObserver | null = null;
	@ViewChild('monacoContainer') monacoContainer!: ElementRef<HTMLDivElement>;

	constructor(private ngZone: NgZone) {}

	ngAfterViewInit() {
		this.loadMonaco();
	}

	ngOnDestroy() {
		if (this.monacoEditor) {
			this.monacoEditor.dispose();
			this.monacoEditor = null;
		}
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
			value: this.code,
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
			id: 'run-code',
			label: 'Run Code',
			keybindings: [
				monaco.KeyCode.F5,
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
			],
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

	runCode() {
		this.output = '';
		this.error = '';
		this.runInSandbox(this.code);
	}

	private runInSandbox(code: string) {
		const iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.sandbox.add('allow-scripts');
		document.body.appendChild(iframe);

		let logs: string[] = [];
		let errorMsg: string | null = null;

		const script = `
        window.onerror = function(msg, url, line, col, error) {
            parent.postMessage({ type: 'error', error: msg }, '*');
        };
        const log = [];
        console.log = function(...args) {
            log.push(args.join(' '));
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
				this.output = logs.join('\n');
			}
			if (event.data.type === 'error') {
				errorMsg = event.data.error;
				this.error = errorMsg ?? '';
			}
			if (event.data.type === 'done') {
				window.removeEventListener('message', onMessage);
				document.body.removeChild(iframe);
			}
		};

		window.addEventListener('message', onMessage);
	}
}
