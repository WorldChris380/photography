import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home-numbers',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home-numbers.html',
  styleUrls: ['./home-numbers.scss']
})
export class HomeNumbers implements OnInit {
  aviationCount = 0;
  travelCount = 0;
  gallery: any[] = [];

  // display values for the count-up animation
  aviationDisplay = 0;
  travelDisplay = 0;

  // countries: presented = from image folder structure, visited = fixed 41
  countriesPresentedTarget = 0;
  countriesPresentedDisplay = 0;
  countriesVisitedTarget = 41;
  countriesVisitedDisplay = 0;

  // animation config
  private ANIMATION_DURATION = 1200; // ms

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('assets/gallery.json').subscribe(data => {
      this.gallery = data || [];
      this.aviationCount = this.gallery.filter(
        img => img.src && img.src.toLowerCase().includes('/aviation/')
      ).length;
      this.travelCount = this.gallery.filter(
        img => img.src && img.src.toLowerCase().includes('/travel/')
      ).length;

      // berechne eindeutige Länder aus dem Pfad (falls Struktur wie oben)
      const countries = new Set<string>();
      this.gallery.forEach(img => {
        if (img.src && typeof img.src === 'string') {
          const parts = img.src.split('/');
          // parts: ['assets','img','photography','Category','Continent','Country', ...]
          if (parts.length > 5) {
            countries.add(parts[5]);
          }
        }
      });
      this.countriesPresentedTarget = countries.size;

      // start animations: fließend hochzählen
      this.animateValue('aviation', this.aviationCount);
      this.animateValue('travel', this.travelCount);

      // start countries animations
      this.countriesPresentedDisplay = 0;
      this.countriesVisitedDisplay = 0;
      this.animateNumber(this.countriesPresentedTarget, v => this.countriesPresentedDisplay = v);
      this.animateNumber(this.countriesVisitedTarget, v => this.countriesVisitedDisplay = v);
    });
  }

  // animate a numeric property from 0 to target using a setter callback
  private animateNumber(target: number, setter: (n: number) => void) {
    const start = performance.now();
    const duration = this.ANIMATION_DURATION;
    const startVal = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeOutCubic(progress);
      const current = Math.floor(startVal + (target - startVal) * eased);
      setter(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setter(target);
      }
    };

    requestAnimationFrame(step);
  }

  // animate a numeric property from 0 to target (existing)
  private animateValue(key: 'aviation' | 'travel', target: number) {
    const start = performance.now();
    const duration = this.ANIMATION_DURATION;
    const startVal = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeOutCubic(progress);
      const current = Math.floor(startVal + (target - startVal) * eased);

      if (key === 'aviation') this.aviationDisplay = current;
      else this.travelDisplay = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (key === 'aviation') this.aviationDisplay = target;
        else this.travelDisplay = target;
      }
    };

    requestAnimationFrame(step);
  }

  // simple easing for nicer effect
  private easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  // add this method so (click)="scrollTo('countries-visited')" works
  scrollTo(id: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      (el as HTMLElement).focus?.({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}