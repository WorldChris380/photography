import { Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

declare global {
  interface Window { paypal?: any; }
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  encapsulation: ViewEncapsulation.None
})
export class Checkout implements OnInit, OnDestroy {
  private scriptEl?: HTMLScriptElement;

  constructor(private http: HttpClient, private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // In dev, PHP endpoints won't run. This will work on the deployed site.
    this.http.get<{ clientId: string }>('get-paypal-client-id.php').subscribe({
      next: ({ clientId }) => this.loadPaypal(clientId),
      error: () => this.loadPaypal('') // fallback; will fail to render buttons without ID
    });
  }

  ngOnDestroy(): void {
    if (this.scriptEl) {
      document.head.removeChild(this.scriptEl);
      this.scriptEl = undefined;
    }
  }

  private loadPaypal(clientId: string) {
    const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=CAPTURE`;
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => this.renderButtons();
    document.head.appendChild(s);
    this.scriptEl = s;
  }

  private renderButtons() {
    if (!window.paypal) return;
    const container = this.host.nativeElement.querySelector('#paypal-buttons');
    window.paypal.Buttons({
      createOrder: () => fetch('create-order.php', { method: 'POST' }).then(r => r.json()).then(d => d.id),
      onApprove: (data: any) => fetch('capture-order.php?orderId=' + encodeURIComponent(data.orderID), { method: 'POST' })
        .then(r => r.json())
        .then(details => {
          alert('Payment completed: ' + (details?.purchase_units?.[0]?.payments?.captures?.[0]?.id || 'OK'));
        }),
    }).render(container);
  }
}
