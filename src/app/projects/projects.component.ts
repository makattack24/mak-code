import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TerminalComponent } from '../terminal/terminal.component';
@Component({
  selector: 'app-projects',
  imports: [RouterOutlet, CommonModule, TerminalComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

}
