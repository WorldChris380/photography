import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class Notifications {
  message: string | null = null;
  type: 'success' | 'error' | null = null;
  countdown: number = 8; // Countdown in Sekunden
  private countdownInterval: any;

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.type = type;
    this.countdown = 8; // Setze den Countdown zurück

    // Starte den Countdown
    this.startCountdown();

    // Nachricht nach 8 Sekunden automatisch ausblenden
    setTimeout(() => {
      this.dismiss(); // Automatisches Schließen
    }, 10000);
  }

  private startCountdown() {
    clearInterval(this.countdownInterval); // Sicherstellen, dass kein altes Intervall läuft
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      }
    }, 1000); // Jede Sekunde den Countdown aktualisieren
  }

  dismiss() {
    this.message = null;
    this.type = null;
    clearInterval(this.countdownInterval); // Countdown-Intervall stoppen
  }
}
