import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogPost, ALL_POSTS } from './data';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	selectedPost: BlogPost | null = null;
	activeCategory = 'All';
	searchQuery = '';
	activeSortOption = 'random';

	categories = ['All', 'Angular', 'C#', '.NET', 'Web Dev', 'DevOps'];

	sortOptions = [
		{ value: 'random', label: 'Shuffle' },
		{ value: 'newest', label: 'Newest First' },
		{ value: 'oldest', label: 'Oldest First' },
		{ value: 'title-az', label: 'Title A–Z' },
		{ value: 'title-za', label: 'Title Z–A' },
		{ value: 'read-time', label: 'Read Time' },
	];

	posts: BlogPost[] = this.shuffleArray([...ALL_POSTS]);

	// Precomputed spans that look random but fill the 3-column grid cleanly
	private spanCache = new Map<string, number[]>();
	private seed = Math.floor(Math.random() * 100000);

	get filteredPosts(): BlogPost[] {
		let result = this.activeCategory === 'All'
			? [...this.posts]
			: this.posts.filter((p) => p.category === this.activeCategory);

		if (this.searchQuery.trim()) {
			const q = this.searchQuery.toLowerCase().trim();
			result = result.filter((p) =>
				p.title.toLowerCase().includes(q) ||
				p.summary.toLowerCase().includes(q) ||
				p.tags.some((t) => t.toLowerCase().includes(q))
			);
		}

		return result;
	}

	getPostSpan(index: number): number {
		const key = this.activeCategory;
		if (!this.spanCache.has(key)) {
			this.spanCache.set(key, this.buildSpans(this.filteredPosts));
		}
		return this.spanCache.get(key)![index] ?? 1;
	}

	/**
	 * Builds a span array that fills 3-column rows with varied sizes.
	 * Uses a simple hash of the post id for deterministic "randomness".
	 */
	private buildSpans(posts: BlogPost[]): number[] {
		const spans: number[] = [];
		let remaining = 3; // columns left in current row

		for (let i = 0; i < posts.length; i++) {
			const hash = this.hashId(posts[i].id + i * 7 + this.seed);
			let span: number;

			if (i === 0 && posts.length > 2) {
				// First post is always a hero
				span = 3;
			} else if (remaining === 3) {
				// Starting a new row — pick a varied size
				const roll = hash % 10;
				if (roll < 2 && posts.length - i >= 3) {
					span = 1; // ~20%: three singles
				} else if (roll < 5 && posts.length - i >= 2) {
					span = 2; // ~30%: wide + single
				} else if (roll < 7 && posts.length - i >= 2) {
					span = 1; // ~20%: single then decide
				} else {
					span = 3; // ~30%: full-width
				}
			} else if (remaining === 2) {
				const roll = hash % 6;
				if (roll < 3 && posts.length - i >= 2) {
					span = 1; // two singles to fill
				} else {
					span = 2; // one wide to fill
				}
			} else {
				span = 1; // only 1 column left
			}

			// Safety: don't exceed remaining columns
			span = Math.min(span, remaining);
			spans.push(span);
			remaining -= span;
			if (remaining <= 0) remaining = 3;
		}

		return spans;
	}

	private hashId(n: number): number {
		let h = n * 2654435761;
		h = ((h >>> 16) ^ h) * 0x45d9f3b;
		h = (h >>> 16) ^ h;
		return Math.abs(h);
	}

	private shuffleArray(arr: BlogPost[]): BlogPost[] {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	onSearchChange(): void {
		this.spanCache.clear();
	}

	onSortChange(): void {
		switch (this.activeSortOption) {
			case 'newest':
				this.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
				break;
			case 'oldest':
				this.posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				break;
			case 'title-az':
				this.posts.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'title-za':
				this.posts.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case 'read-time':
				this.posts.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
				break;
			case 'random':
				this.shuffleArray(this.posts);
				break;
		}
		this.spanCache.clear();
	}

	selectCategory(category: string): void {
		this.activeCategory = category;
		this.selectedPost = null;
		this.spanCache.clear();
	}

	openPost(post: BlogPost): void {
		this.selectedPost = post;
	}

	closePost(): void {
		this.selectedPost = null;
	}

	getParagraphs(content: string): string[] {
		return content.split('\n\n');
	}

	isCodeBlock(paragraph: string): boolean {
		return paragraph.startsWith('```');
	}

	stripCodeFences(paragraph: string): string {
		return paragraph
			.replace(/```\w*\n?/g, '')
			.replace(/```$/g, '');
	}

	formatText(paragraph: string): string {
		return paragraph
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
	}
}
