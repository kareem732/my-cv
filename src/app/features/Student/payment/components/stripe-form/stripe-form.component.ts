import {
  Component,
  input,
  output,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  loadStripe,
  Stripe,
  StripeElements,
  StripePaymentElement
} from '@stripe/stripe-js';

import { ThemeService } from '../../../../../core/services/Theme/theme.service';

const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51T8m2C2H9RfgbqNTQbLHb3NDxMKItRHWWbGi4eneask4P3dpKqFY4LkyYiXIR8cwDBbCCAzqi6VAC2rB2Ntjdi7g00NUSBRf8m';

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

@Component({
  selector: 'app-stripe-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stripe-form.component.html',
  styleUrl: './stripe-form.component.css'
})
export class StripeFormComponent implements AfterViewInit, OnDestroy {

  @ViewChild('paymentElement')
  paymentElementRef!: ElementRef<HTMLDivElement>;

  clientSecret = input.required<string>();

  paymentSuccess = output<void>();
  paymentError   = output<string>();

  private stripe:    Stripe | null         = null;
  private elements:  StripeElements | null = null;
  private paymentEl: StripePaymentElement | null = null;

  private themeService = inject(ThemeService);

  isLoading    = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  stripeReady  = signal(false);

  async ngAfterViewInit(): Promise<void> {

    await new Promise(resolve => setTimeout(resolve));

    try {
      this.stripe = await getStripe();

      if (!this.stripe) {
        throw new Error('Stripe failed to load.');
      }

      const isDark = this.themeService.isDark();

      this.elements = this.stripe.elements({
        clientSecret: this.clientSecret(),
        appearance: {
          theme: isDark ? 'night' : 'stripe',
          variables: {
            colorPrimary:     '#3b82f6',
            colorBackground:  isDark ? '#1f2937' : '#ffffff',
            colorText:        isDark ? '#f9fafb' : '#1f2937',
            colorDanger:      '#ef4444',
            fontFamily:       'Inter, system-ui, sans-serif',
            borderRadius:     '10px',
          }
        }
      });

      this.paymentEl = this.elements.create('payment');
      this.paymentEl.mount(this.paymentElementRef.nativeElement);

      this.paymentEl.on('ready', () => {
        this.isLoading.set(false);
        this.stripeReady.set(true);
      });

      this.paymentEl.on('change', (event) => {
        if (event.complete) {
          this.errorMessage.set(null);
        }
      });

    } catch (err) {
      this.errorMessage.set('Failed to initialize payment form.');
      this.isLoading.set(false);
    }
  }

  async submitPayment(): Promise<void> {

    if (!this.stripe || !this.elements || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/student/payment/result`,
      },
      redirect: 'if_required',
    });

    if (error) {
      const msg = error.message ?? 'Payment failed.';
      this.errorMessage.set(msg);
      this.isSubmitting.set(false);
      this.paymentError.emit(msg);
    } else {
      this.paymentSuccess.emit();
    }
  }

  ngOnDestroy(): void {
    this.paymentEl?.unmount();
  }
}
