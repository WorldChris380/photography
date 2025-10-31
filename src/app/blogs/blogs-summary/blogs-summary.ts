import { Component, Input, OnDestroy, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogs-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogs-summary.html',
  styleUrl: './blogs-summary.scss',
  encapsulation: ViewEncapsulation.None
})
export class BlogsSummary implements OnInit, OnDestroy {
  @Input() titleLine1 = 'Aviation &';
  @Input() titleLine2 = 'Travel Blog';
  @Input() subtitle = 'Explore the world through flight simulation, real aviation experiences, and travel adventures';
  @Input() postsCount = 1;
  @Input() categoriesCount = 3;

  animatedPosts = 0;
  animatedCategories = 0;

  private observer?: IntersectionObserver;
  private rafId?: number;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Animate numbers when section enters viewport
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.startCounters();
          this.observer?.disconnect();
        }
      });
    }, { threshold: 0.3 });

    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private startCounters() {
    const duration = 1200; // ms
    const start = performance.now();
    const fromPosts = 0;
    const toPosts = Math.max(0, this.postsCount);
    const fromCats = 0;
    const toCats = Math.max(0, this.categoriesCount);

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeOutCubic(t);
      this.animatedPosts = Math.round(fromPosts + (toPosts - fromPosts) * e);
      this.animatedCategories = Math.round(fromCats + (toCats - fromCats) * e);
      if (t < 1) {
        this.rafId = requestAnimationFrame(step);
      }
    };

    this.rafId = requestAnimationFrame(step);
  }
}
