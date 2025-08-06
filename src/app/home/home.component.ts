import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AsyncPipe, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public auth: AuthService) { }
}