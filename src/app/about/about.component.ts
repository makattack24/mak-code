import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
@Component({
	selector: 'app-about',
	imports: [CommonModule, MarkdownModule],
	templateUrl: './about.component.html',
	styleUrl: './about.component.scss',
})
export class AboutComponent {}
