import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayoutInstructorService, WalletInfo, Payout } from '../../../../core/services/payoutInstructor/payout-instructor.service';

@Component({
  selector: 'app-payout',
  imports: [CommonModule, FormsModule],
  templateUrl: './payout.component.html',
  styleUrl: './payout.component.css'
})
export class PayoutComponent implements OnInit {
  private payoutService = inject(PayoutInstructorService);

  wallet = signal<WalletInfo | null>(null);
  payouts = signal<Payout[]>([]);
  requestAmount = signal<number>(0);

  walletLoading = signal(false);
  payoutsLoading = signal(false);
  requestLoading = signal(false);
  stripeLoading = signal(false);

  walletError = signal('');
  payoutsError = signal('');
  requestError = signal('');
  requestSuccess = signal('');
  stripeError = signal('');
  stripeSuccess = signal('');

  isStripeConnected = computed(() => this.wallet()?.isStripeConnected ?? false);
  hasPayouts = computed(() => this.payouts().length > 0);
  canRequest = computed(() => this.requestAmount() > 0 && this.isStripeConnected());

  ngOnInit(): void {
    this.loadWallet();
    this.loadPayouts();
  }

  loadWallet(): void {
    this.walletLoading.set(true);
    this.walletError.set('');
    this.payoutService.getWallet().subscribe({
      next: (data) => {
        this.wallet.set(data);
        this.walletLoading.set(false);
      },
      error: () => {
        this.walletError.set('Failed to load wallet info.');
        this.walletLoading.set(false);
      }
    });
  }

  loadPayouts(): void {
    this.payoutsLoading.set(true);
    this.payoutsError.set('');
    this.payoutService.getMyPayouts().subscribe({
      next: (data) => {
        this.payouts.set(data);
        this.payoutsLoading.set(false);
      },
      error: () => {
        this.payoutsError.set('Failed to load payouts.');
        this.payoutsLoading.set(false);
      }
    });
  }

  connectStripe(): void {
    this.stripeLoading.set(true);
    this.stripeError.set('');
    this.stripeSuccess.set('');
    this.payoutService.connectStripe().subscribe({
      next: () => {
        this.stripeSuccess.set('Stripe connected successfully!');
        this.stripeLoading.set(false);
        this.loadWallet();
        setTimeout(() => this.stripeSuccess.set(''), 4000);
      },
      error: () => {
        this.stripeError.set('Failed to connect Stripe. Please try again.');
        this.stripeLoading.set(false);
      }
    });
  }

  requestPayout(): void {
    if (!this.canRequest()) return;
    this.requestLoading.set(true);
    this.requestError.set('');
    this.requestSuccess.set('');
    this.payoutService.requestPayout(this.requestAmount()).subscribe({
      next: () => {
        this.requestSuccess.set('Payout requested successfully!');
        this.requestAmount.set(0);
        this.requestLoading.set(false);
        this.loadWallet();
        this.loadPayouts();
      },
      error: (err) => {
        const body = err?.error;
        if (body?.errors && typeof body.errors === 'object') {
          const messages = Object.values(body.errors).flat().join(' ');
          this.requestError.set(messages as string);
        } else if (body?.message) {
          this.requestError.set(body.message);
        } else {
          this.requestError.set('Failed to request payout. Try again.');
        }
        this.requestLoading.set(false);
      }
    });
  }

  onAmountChange(value: string): void {
    this.requestAmount.set(+value);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':   return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
}
