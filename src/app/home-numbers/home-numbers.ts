import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-numbers',
  standalone: true,
  imports: [],
  templateUrl: './home-numbers.html',
  styleUrl: './home-numbers.scss'
})
export class HomeNumbers {
  aviationCount = 0;
  travelCount = 0;
  gallery: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('assets/gallery.json').subscribe(data => {
      this.gallery = data;
      this.aviationCount = this.gallery.filter(
        img => img.src && img.src.toLowerCase().includes('/aviation/')
      ).length;
      this.travelCount = this.gallery.filter(
        img => img.src && img.src.toLowerCase().includes('/travel/')
      ).length;
    });
  }
}