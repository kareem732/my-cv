import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseOrder } from '../../../../../core/services/Order/order.service';

@Component({
  selector: 'app-price-breakdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-breakdown.component.html',
})
export class PriceBreakdownComponent {
  order = input.required<CourseOrder>();
}
