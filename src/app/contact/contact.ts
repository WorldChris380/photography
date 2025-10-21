import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importiere FormsModule
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule], // Füge FormsModule hier hinzu
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact {
  name = '';
  email = '';
  message = '';

  constructor(private http: HttpClient, private app: AppComponent) { }

  onSubmit() {
    const formData = {
      name: this.name,
      email: this.email,
      message: this.message
    };

    this.http.post('https://photography.christian-boehme.com/send-email', formData).subscribe({
      next: () => {
        this.app.showNotification('Your message has been sent successfully!', 'success');
        this.name = '';
        this.email = '';
        this.message = '';
      },
      error: () => {
        this.app.showNotification('An error occurred while sending your message. Please try again.', 'error');
      }
    });
  }
}
