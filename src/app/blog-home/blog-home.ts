import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AppComponent } from '../app';

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
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './blog-home.html',
  styleUrl: './blog-home.scss',
  encapsulation: ViewEncapsulation.None
})
export class BlogHome {
  constructor(private http: HttpClient, private app: AppComponent) {}

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

  // Newsletter state
  newsletterEmail = '';
  submitting = false;

  submitNewsletter() {
    const email = this.newsletterEmail.trim();
    if (!email) {
      this.app.showNotification('Please enter a valid email address.', 'error');
      return;
    }
    this.submitting = true;
    // Use the production API endpoint (CORS enabled on server)
    const endpoint = 'https://photography.christian-boehme.com/api/newsletter-signup.php';
    this.http.post(endpoint, { email }).subscribe({
      next: () => {
        this.app.showNotification('Thanks! You\'re on the list.', 'success');
        this.newsletterEmail = '';
      },
      error: () => {
        this.app.showNotification('Could not submit your email. Please try again later.', 'error');
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}
