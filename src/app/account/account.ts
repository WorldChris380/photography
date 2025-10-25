import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface Purchase {
  description: string;
  created_at: number;
  price: string;
  currency: string;
  src: string;
}

interface User {
  email: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class AccountComponent implements OnInit {
  isLoggedIn = false;
  activeTab = 'emailLink';
  
  // Email link login
  emailLinkEmail = '';
  emailLinkMessage = '';
  
  // Password login
  passEmail = '';
  passPassword = '';
  passLoginMessage = '';
  
  // Registration
  regEmail = '';
  regPassword = '';
  regMessage = '';
  
  // Profile
  profileEmail = '';
  saveMessage = '';
  
  // Purchases
  purchases: Purchase[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.checkSession();
    this.handleHashNavigation();
  }

  handleHashNavigation() {
    // Smooth scroll to #downloads or #profile if in URL
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.emailLinkMessage = '';
    this.passLoginMessage = '';
    this.regMessage = '';
  }

  async checkSession() {
    try {
      const response = await this.http.get<{ user: User }>('/api/me.php').toPromise();
      if (response && response.user) {
        this.isLoggedIn = true;
        this.profileEmail = response.user.email || '';
        this.loadPurchases();
      }
    } catch (e) {
      this.isLoggedIn = false;
    }
  }

  async sendLoginLink() {
    this.emailLinkMessage = '';
    const email = this.emailLinkEmail.trim();
    if (!email) {
      this.emailLinkMessage = 'Please enter your email.';
      return;
    }
    
    try {
      await this.http.post('/api/login-request.php', { email }).toPromise();
      this.emailLinkMessage = 'Check your inbox for the login link. It expires in 15 minutes.';
    } catch (e) {
      this.emailLinkMessage = 'Could not send login link. Please try again.';
    }
  }

  async loginWithPassword() {
    this.passLoginMessage = '';
    const email = this.passEmail.trim();
    const password = this.passPassword;
    
    if (!email || !password) {
      this.passLoginMessage = 'Please enter email and password.';
      return;
    }
    
    try {
      await this.http.post('/api/login-password.php', { email, password }).toPromise();
      await this.checkSession();
    } catch (e) {
      this.passLoginMessage = 'Invalid email or password.';
    }
  }

  async register() {
    this.regMessage = '';
    const email = this.regEmail.trim();
    const password = this.regPassword;
    
    if (!email || !password) {
      this.regMessage = 'Please enter email and password.';
      return;
    }
    
    try {
      await this.http.post('/api/register.php', { email, password }).toPromise();
      this.regMessage = 'Account created. You are now signed in.';
      await this.checkSession();
    } catch (e) {
      this.regMessage = 'Could not create account. This email may already be registered.';
    }
  }

  async saveEmail() {
    this.saveMessage = '';
    const email = this.profileEmail.trim();
    
    if (!email) {
      this.saveMessage = 'Please enter an email.';
      return;
    }
    
    try {
      await this.http.post('/api/update-email.php', { email }).toPromise();
      this.saveMessage = 'Saved.';
    } catch (e) {
      this.saveMessage = 'Could not save. This email might already be in use.';
    }
  }

  async loadPurchases() {
    try {
      const response = await this.http.get<{ items: Purchase[] }>('/api/purchases.php').toPromise();
      if (response && response.items) {
        this.purchases = response.items;
      }
    } catch (e) {
      console.error('Could not load purchases:', e);
    }
  }

  async logout() {
    try {
      await this.http.post('/api/logout.php', {}).toPromise();
      this.isLoggedIn = false;
      this.purchases = [];
      this.profileEmail = '';
      this.router.navigate(['/account']);
    } catch (e) {
      console.error('Logout error:', e);
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }
}