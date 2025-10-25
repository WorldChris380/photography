import { Injectable } from '@angular/core';
import { PAYPAL_CURRENCY, PAYPAL_INTENT } from './payments.config';

@Injectable({ providedIn: 'root' })
export class PaypalService {
  private loadingPromise: Promise<any> | null = null;

  async load(): Promise<any> {
    // Already loaded
    if ((window as any).paypal) {
      return Promise.resolve((window as any).paypal);
    }
    // In-flight load
    if (this.loadingPromise) return this.loadingPromise;

    // Fetch client id from server to avoid client/server mismatch
    const cfgUrl = 'https://photography.christian-boehme.com/get-paypal-client-id.php';
    const cfgResp = await fetch(cfgUrl, { method: 'GET' });
    if (!cfgResp.ok) {
      throw new Error('Failed to fetch PayPal configuration');
    }
    const cfg = await cfgResp.json().catch(() => ({}));
    const clientId = cfg?.client_id as string;
    if (!clientId) {
      throw new Error('PayPal client ID missing from server');
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const params = new URLSearchParams({
        'client-id': clientId,
        currency: PAYPAL_CURRENCY,
        intent: PAYPAL_INTENT.toLowerCase(),
        commit: 'true',
        components: 'buttons'
      });
      script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
      script.async = true;
      script.onload = () => resolve((window as any).paypal);
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });

    return this.loadingPromise;
  }
}
