import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-game',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  target = this.randomNumber();
  guess: number | null = null;
  message = 'Guess a number between 1 and 100!';
  attempts = 0;
  finished = false;

  randomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  submitGuess() {
    if (this.guess == null || this.finished) return;
    this.attempts++;
    if (this.guess === this.target) {
      this.message = `🎉 Correct! The number was ${this.target}. Attempts: ${this.attempts}`;
      this.finished = true;
    } else if (this.guess < this.target) {
      this.message = 'Too low! Try again.';
    } else {
      this.message = 'Too high! Try again.';
    }
  }

  reset() {
    this.target = this.randomNumber();
    this.guess = null;
    this.message = 'Guess a number between 1 and 100!';
    this.attempts = 0;
    this.finished = false;
  }
}