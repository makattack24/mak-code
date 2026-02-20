import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-calculator',
	standalone: true,
	imports: [],
	templateUrl: './calculator.component.html',
	styleUrl: './calculator.component.scss',
})
export class CalculatorComponent {
	display = '';
	expression = '';

	press(key: string) {
		if (key === '=') {
			this.calculate();
		} else if (key === '%') {
			// Convert current number to percentage
			if (this.display) {
				this.display += '/100';
			}
		} else {
			this.display += key;
		}
	}

	clear() {
		this.expression = '';
		this.display = '';
	}

	backspace() {
		this.display = this.display.slice(0, -1);
	}

	calculate() {
		try {
			if (!this.display) return;
			// Only allow numbers, operators, parentheses, and decimal points
			if (/^[\d+\-*/().\s]+$/.test(this.display)) {
				const input = this.display;
				// eslint-disable-next-line no-new-func
				const result = Function(
					'"use strict";return (' + this.display + ')'
				)();
				this.expression = input;
				this.display = String(
					Number.isInteger(result)
						? result
						: parseFloat(result.toFixed(10))
				);
			} else {
				this.display = 'Error';
			}
		} catch {
			this.display = 'Error';
		}
	}

	@HostListener('window:keydown', ['$event'])
	onKey(event: KeyboardEvent) {
		const allowed = [
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'.', '+', '-', '*', '/', '(', ')',
		];
		if (allowed.includes(event.key)) {
			this.display += event.key;
			event.preventDefault();
		} else if (event.key === 'Enter' || event.key === '=') {
			this.calculate();
			event.preventDefault();
		} else if (event.key === 'Backspace') {
			this.backspace();
			event.preventDefault();
		} else if (event.key.toLowerCase() === 'c' || event.key === 'Escape') {
			this.clear();
			event.preventDefault();
		} else if (event.key === '%') {
			this.press('%');
			event.preventDefault();
		}
	}
}
