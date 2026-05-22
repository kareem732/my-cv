import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OrderService, CourseOrder } from '../../../core/services/Order/order.service';
import { CheckoutStateService } from '../../../core/services/CheckoutState/checkout-state.service';

import { CouponFormComponent } from './components/coupon-form/coupon-form.component';
import { PriceBreakdownComponent } from './components/price-breakdown/price-breakdown.component';

interface NavState {
  courseId: number;
  title: string;
  price: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CouponFormComponent,
    PriceBreakdownComponent
  ],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {

  private router = inject(Router);
  private orderService = inject(OrderService);
  private checkoutState = inject(CheckoutStateService);

  order = signal<CourseOrder | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  courseId = signal<number>(0);

  appliedCoupon = signal<string | null>(null);

  navState?: NavState;

  constructor() {
    this.navState =
      this.router.getCurrentNavigation()?.extras?.state || history.state;
  }

  ngOnInit(): void {
    if (!this.navState?.courseId) {
      this.error.set('No course selected');
      this.isLoading.set(false);
      return;
    }

    this.courseId.set(this.navState.courseId);
    this.createOrder(this.navState.courseId);
  }

  private createOrder(courseId: number) {
    this.isLoading.set(true);

    this.orderService.createOrder({ courseIds: [courseId] })
      .subscribe({
        next: (order) => {
          this.order.set(order);
          this.checkoutState.setOrder(order);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to create order');
          this.isLoading.set(false);
        }
      });
  }

  onCouponApplied(updated: CourseOrder, couponCode?: string) {
    this.updateOrder(updated);

    if (updated.discountAmount && updated.discountAmount > 0) {
      this.appliedCoupon.set(couponCode ?? 'COUPON');
    }
  }

  removeCoupon() {
    const o = this.order();
    if (!o) return;

    const resetOrder: CourseOrder = {
      ...o,
      discountAmount: 0,
      finalPrice: o.totalPrice,
    };

    this.order.set(resetOrder);
    this.checkoutState.setOrder(resetOrder);
    this.appliedCoupon.set(null);
  }

  private updateOrder(updated: CourseOrder) {
    const current = this.order();
    if (!current) return;

    const merged: CourseOrder = {
      ...current,
      ...updated,
      clientSecret: current.clientSecret
    };

    this.order.set(merged);
    this.checkoutState.setOrder(merged);
  }

  proceedToPayment() {
    const o = this.order();
    if (!o) return;

    this.checkoutState.setOrder(o);

    if (o.isFree || o.finalPrice === 0) {
      this.router.navigate(['/student/payment/result'], {
        state: { success: true, isFree: true, orderId: o.orderId }
      });
      return;
    }

    this.router.navigate(['/student/payment']);
  }
}
