import { Component, HostListener, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { CommonModule } from '@angular/common';
import { fadeSlideInOut } from './animations';
import { ViewportScroller } from '@angular/common';
import { Notifications } from './notifications/notifications';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer, Notifications],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  animations: [fadeSlideInOut]
})
export class AppComponent implements OnInit {
  protected readonly title = signal('photography');
  showBackToTop = false;

  constructor(private renderer: Renderer2, private viewportScroller: ViewportScroller) { }

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

  onActivate() {
    // Scrollt beim Aktivieren einer neuen Route nach oben
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  @ViewChild(Notifications) notifications!: Notifications;

  showNotification(message: string, type: 'success' | 'error') {
    this.notifications.showMessage(message, type);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    this.showBackToTop = y > 400;
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
