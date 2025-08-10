import { Component, OnInit, Renderer2, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { PhotoGallery } from './photo-gallery/photo-gallery';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  protected readonly title = signal('photography');

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.listen('document', 'contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      showTooltip(event.clientX, event.clientY);
    });
  }
}

function showTooltip(x: number, y: number) {
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
