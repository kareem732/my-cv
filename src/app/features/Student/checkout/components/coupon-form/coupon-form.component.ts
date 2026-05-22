import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderService, CourseOrder } from '../../../../../core/services/Order/order.service';

@Component({
  selector: 'app-coupon-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coupon-form.component.html',
})
export class CouponFormComponent {

  private orderService = inject(OrderService);

  orderId = input.required<number>();

  orderUpdated = output<CourseOrder>();
  couponRemoved = output<void>();

  couponCode = signal<string>('');
  couponApplied = signal<boolean>(false);

  isApplying = signal(false);
  errorMsg = signal<string | null>(null);

  successMsg = signal<string>('Coupon applied successfully');

  isDisabled = () => this.isApplying() || !this.couponCode().trim();

  applyCoupon() {
    const code = this.couponCode().trim();
    if (!code) return;

    this.isApplying.set(true);
    this.errorMsg.set(null);

    this.orderService.applyCoupon(this.orderId(), { couponCode: code })
      .subscribe({
        next: (order: CourseOrder) => {
          this.orderUpdated.emit(order);
          this.couponApplied.set(true);
          this.successMsg.set(`${code} applied successfully`);
          this.isApplying.set(false);
        },
        error: () => {
          this.errorMsg.set('Invalid or expired coupon');
          this.isApplying.set(false);
        }
      });
  }

  removeCoupon() {
    this.couponCode.set('');
    this.couponApplied.set(false);
    this.errorMsg.set(null);
    this.couponRemoved.emit();
  }
}
