import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface BlogPost {
  title: string;
  excerpt: string;
  category: 'aviation' | 'travel' | 'tech';
  date: string;
  image: string;
  route: string;
  readTime: number;
}

@Component({
  selector: 'app-blog-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-home.html',
  styleUrl: './blog-home.scss',
  encapsulation: ViewEncapsulation.None
})
export class BlogHome {
  posts: BlogPost[] = [
    {
      title: 'Career Add-ons for Flight Simulation',
      excerpt: 'Discover the best add-ons to enhance your virtual aviation career. From realistic airline operations to comprehensive flight tracking.',
      category: 'aviation',
      date: 'October 2025',
      image: 'assets/img/blog/flight-sim.jpg',
      route: '/blogs/flight-simulation-career-addons',
      readTime: 8
    }
  ];

  categories = [
    { name: 'Aviation', icon: '✈️', count: 1, filter: 'aviation' },
    { name: 'Travel', icon: '🌍', count: 0, filter: 'travel' },
    { name: 'Technology', icon: '💻', count: 0, filter: 'tech' }
  ];
}
