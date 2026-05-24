import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../../../../core/services/notifications/notifications.service';

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
  private router                = inject(Router);
  private notificationsService  = inject(NotificationsService);

  isSuccess    = signal(false);
  orderId      = signal<number | null>(null);
  errorMessage = signal<string>('Payment was not completed.');
  isFree       = signal(false);

  ngOnInit(): void {
    const state = history.state as unknown as PaymentResultState;

    this.isSuccess.set(state?.success === true);
    this.orderId.set(typeof state?.orderId === 'number' ? state.orderId : null);
    this.errorMessage.set(typeof state?.message === 'string' ? state.message : 'Payment was not completed.');
    this.isFree.set(state?.isFree === true);

    const params = new URLSearchParams(window.location.search);
    const redirectStatus = params.get('redirect_status');
    if (redirectStatus === 'succeeded') {
      this.isSuccess.set(true);
    } else if (redirectStatus === 'failed') {
      this.isSuccess.set(false);
    }

    if (this.isSuccess()) {
      this.notificationsService.refresh().subscribe();
    }
  }

  goToMyCourses(): void {
    this.router.navigate(['/student/profile/my-learnings']);
  }

  tryAgain(): void {
    history.back();
  }
}
