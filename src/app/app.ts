import { Component, OnInit, Renderer2, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { CommonModule } from '@angular/common';
import { fadeSlideInOut } from './animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  animations: [fadeSlideInOut]
})
export class AppComponent implements OnInit {
  protected readonly title = signal('photography');

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.listen('document', 'contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      this.showTooltip(event.clientX, event.clientY);
    });
  }

  private showTooltip(x: number, y: number) {
    let tooltip = document.createElement('div');
    tooltip.innerText = 'Right-click for copyright reasons not possible on this website.';
    tooltip.style.position = 'fixed';
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.background = '#212529';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '6px 14px';
    tooltip.style.borderRadius = '8px';
    tooltip.style.fontSize = '1rem';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '9999';
    document.body.appendChild(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 1200);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] || outlet?.activatedRoute?.snapshot?.url;
  }

  getRouteState(outlet: RouterOutlet | null) {
    if (!outlet || !outlet.isActivated) {
      return 'initial';
    }
    // Nutze die Route-URL als eindeutigen State-Identifier
    return outlet.activatedRoute.snapshot.url.join('/') || 'home';
  }

  getState(o: RouterOutlet) {
    // Simplified state handling to avoid null issues
    return o && o.activatedRouteData ? o.activatedRouteData['animation'] : 'initial';
  }
}
