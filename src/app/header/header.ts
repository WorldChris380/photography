import { Component, Renderer2, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit {
  menuOpen = false;
  darkMode = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    const saved = localStorage.getItem('darkmode');
    this.darkMode = saved === 'true';
    this.applyDarkMode();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkmode', String(this.darkMode));
    this.applyDarkMode();
  }

  private applyDarkMode() {
    const galleryLimitation = document.getElementById('gallery-limitation');
    if (this.darkMode) {
      this.renderer.addClass(document.body, 'darkmode');
      if (galleryLimitation) {
        this.renderer.setStyle(galleryLimitation, 'background', '#212529');
        this.renderer.setStyle(galleryLimitation, 'color', '#f1f3f4');
      }
    } else {
      this.renderer.removeClass(document.body, 'darkmode');
      if (galleryLimitation) {
        this.renderer.removeStyle(galleryLimitation, 'background');
        this.renderer.removeStyle(galleryLimitation, 'color');
      }
    }
  }
}
