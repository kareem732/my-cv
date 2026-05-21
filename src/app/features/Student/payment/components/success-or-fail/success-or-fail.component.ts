import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface PaymentResultState {
  success: boolean;
  orderId?: number;
  message?: string;
  isFree?: boolean;
}

@Component({
  selector: 'app-success-or-fail',
  imports: [CommonModule],
  templateUrl: './success-or-fail.component.html',
  styleUrl: './success-or-fail.component.css'
})
export class SuccessOrFailComponent implements OnInit {
  private router = inject(Router);

  isSuccess = signal(false);
  orderId = signal<number | null>(null);
  errorMessage = signal<string>('Payment was not completed.');
  isFree = signal(false);

  ngOnInit(): void {
    const state = (history.state) as PaymentResultState;

    this.isSuccess.set(state?.success ?? false);
    this.orderId.set(state?.orderId ?? null);
    this.errorMessage.set(state?.message ?? 'Payment was not completed.');
    this.isFree.set(state?.isFree ?? false);

    // لو Stripe عمل redirect بياخد النتيجة من URL
    const params = new URLSearchParams(window.location.search);
    const redirectStatus = params.get('redirect_status');
    if (redirectStatus === 'succeeded') {
      this.isSuccess.set(true);
    } else if (redirectStatus === 'failed') {
      this.isSuccess.set(false);
    }
  }

  goToMyCourses() {
    this.router.navigate(['/student/profile/my-learnings']);
  }

  tryAgain() {
    history.back();
  }
}

