import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import gallery from '../../assets/gallery.json';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.html',
  styleUrls: ['./photo-gallery.scss'],
})
export class PhotoGallery {
  images = gallery as { src: string; category: string; description: string }[];
}