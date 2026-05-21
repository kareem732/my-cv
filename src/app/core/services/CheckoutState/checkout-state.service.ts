import { Injectable, signal } from '@angular/core';
import { CourseOrder } from '../Order/order.service';

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {

  private _order = signal<CourseOrder | null>(null);

  order = this._order.asReadonly();

  setOrder(order: CourseOrder) {
    this._order.set(order);
  }

  clearOrder() {
    this._order.set(null);
  }
}
