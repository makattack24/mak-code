import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  code: string = '';
  output: string = '';
  error: string = '';

  @ViewChild('editorTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  get lineNumbers(): number[] {
    return Array(this.code.split('\n').length).fill(0).map((_, i) => i + 1);
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
    try {
      // eslint-disable-next-line no-eval
      const result = eval(this.code);
      this.output = String(result);
    } catch (error: any) {
      this.error = error.message || 'Error executing code';
    }
  }
}