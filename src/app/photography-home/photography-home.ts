import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photography-home',
  templateUrl: './photography-home.html',
  styleUrls: ['./photography-home.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PhotographyHome {
  atfImages = [
    'assets/img/photography/travel/Costa Rica Hot Springs Tabacon.jpg',
    'assets/img/photography/travel/australia/Outback Australia.jpg'
  ];
  atfIndex = 0;

  ngOnInit() {
    setInterval(() => {
      this.atfIndex = (this.atfIndex + 1) % this.atfImages.length;
    }, 4000); // alle 4 Sekunden wechseln
  }
}