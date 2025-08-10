import { Component, Renderer2, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Header implements OnInit {
  menuOpen = false;
  darkMode = false;

  constructor(private renderer: Renderer2) { }

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
    if (this.darkMode) {
      this.renderer.addClass(document.body, 'darkmode');
    } else {
      this.renderer.removeClass(document.body, 'darkmode');
    }
  }

  closeMenuDelayed() {
    setTimeout(() => this.menuOpen = false, 150);
  }
}