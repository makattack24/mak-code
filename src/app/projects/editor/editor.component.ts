import { Component, ViewChild, ElementRef, AfterViewInit, HostListener} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-editor',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './editor.component.html',
	styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit {
	code: string = `// Define your function\nfunction add(a, b) {\n  return a + b;\n}\n\n// Test cases\nconsole.log(add(2, 3)); // 5\nconsole.log(add(-1, 1)); // 0`;
	output: string = '';
	error: string = '';

	@ViewChild('editorTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

	get lineNumbers(): number[] {
		return Array(this.code.split('\n').length).fill(0).map((_, i) => i + 1);
	}

	// Add keyboard shortcut listeners
    @HostListener('document:keydown', ['$event'])
    handleKeyboardShortcut(event: KeyboardEvent) {
        // F5 to run code
        if (event.key === 'F5') {
            event.preventDefault();
            this.runCode();
        }
        // Ctrl+Enter to run code
        else if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            this.runCode();
        }
        // Ctrl+Shift+R to run code
        else if (event.ctrlKey && event.shiftKey && event.key === 'R') {
            event.preventDefault();
            this.runCode();
        }
    }
	
	ngAfterViewInit() {
		this.autoResize();
	}

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

	runCode() {
		this.output = '';
		this.error = '';
		this.runInSandbox(this.code);
	}

	highlightLine(lineIndex: number) {
		const lines = this.code.split('\n');
		let start = 0;
		for (let i = 0; i < lineIndex; i++) {
			start += lines[i].length + 1; // +1 for the newline
		}
		const end = start + lines[lineIndex].length;
		const textarea = this.textarea?.nativeElement;
		if (textarea) {
			textarea.focus();
			textarea.setSelectionRange(start, end);
		}
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