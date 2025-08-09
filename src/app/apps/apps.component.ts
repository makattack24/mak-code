import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResizeService } from '../services/resize.service';
@Component({
  selector: 'app-apps',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss'
})
export class AppsComponent {
  sidebarCollapsed = false;
  constructor(private resizeService: ResizeService) {}
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    setTimeout(() => {
      this.resizeService.triggerResize();
    }, 0);
  }
}
