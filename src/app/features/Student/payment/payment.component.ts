import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StripeFormComponent } from './components/stripe-form/stripe-form.component';
import { CheckoutStateService } from '../../../core/services/CheckoutState/checkout-state.service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, StripeFormComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  private router = inject(Router);
  private checkoutState = inject(CheckoutStateService);

  clientSecret = signal<string | null>(null);
  orderId = signal<number | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const order = this.checkoutState.order();

    if (!order || !order.clientSecret) {
      this.error.set('Payment session expired. Please go back and try again.');
      return;
    }

    this.clientSecret.set(order.clientSecret);
    this.orderId.set(order.orderId);
  }

  onPaymentSuccess() {
    this.checkoutState.clearOrder();
    this.router.navigate(['/student/payment/result'], {
      state: { success: true, orderId: this.orderId() }
    });
  }

  onPaymentError(message: string) {
    this.router.navigate(['/student/payment/result'], {
      state: { success: false, message }
    });
  }
}
