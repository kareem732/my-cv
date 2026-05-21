import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coupon, CouponsService, CreateCouponBody } from '../../../../core/services/Coupons/coupons.service';

@Component({
  selector: 'app-copons',
  imports: [CommonModule, FormsModule],
  templateUrl: './copons.component.html',
  styleUrl: './copons.component.css'
})
export class CoponsComponent implements OnInit {

  private couponsService = inject(CouponsService);

  coupons         = signal<Coupon[]>([]);
  isLoading       = signal(false);
  error           = signal<string | null>(null);

  showModal       = signal(false);
  isEditing       = signal(false);
  editingId       = signal<number | null>(null);

  showDeleteModal = signal(false);
  deletingId      = signal<number | null>(null);

  submitLoading   = signal(false);
  deleteLoading   = signal(false);

  form = signal<CreateCouponBody>({
    code: '',
    discountType: 0,
    discountValue: 0,
    usageLimit: 0,
    expiresAt: ''
  });

  touched = signal({
    code: false,
    discountType: false,
    discountValue: false,
    usageLimit: false,
    expiresAt: false
  });

  touch(field: keyof ReturnType<typeof this.touched>): void {
    this.touched.update(t => ({ ...t, [field]: true }));
  }

  ngOnInit(): void {
    this.loadCoupons();
  }

  private extractApiError(err: any, fallback: string): string {
    const body = err?.error;
    if (typeof body === 'string' && body.trim().length > 0) return body.trim();
    if (body?.message) return body.message;
    if (body?.title)   return body.title;
    if (body?.errors) {
      const msgs = Object.values(body.errors).flat() as string[];
      if (msgs.length > 0) return msgs.join(' — ');
    }
    if (err?.status) return `${fallback} (Server error ${err.status})`;
    return `${fallback} — Check your connection`;
  }

  loadCoupons(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.couponsService.getCoupons(false).subscribe({
      next: (data) => {
        this.coupons.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(this.extractApiError(err, 'Failed to load coupons'));
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.form.set({ code: '', discountType: 0, discountValue: 0, usageLimit: 0, expiresAt: '' });
    this.touched.set({ code: false, discountType: false, discountValue: false, usageLimit: false, expiresAt: false });
    this.showModal.set(true);
  }

  openEdit(coupon: Coupon): void {
    this.isEditing.set(true);
    this.editingId.set(coupon.id);
    this.form.set({
      code: coupon.code,
      discountType: coupon.discountType === 'Percentage' ? 1 : 2,
      discountValue: coupon.discountValue,
      usageLimit: coupon.usageLimit,
      expiresAt: coupon.expiresAt?.slice(0, 16) ?? ''
    });
    this.touched.set({ code: true, discountType: true, discountValue: true, usageLimit: true, expiresAt: true });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.error.set(null);
  }

  updateForm(field: keyof CreateCouponBody, value: any): void {
    this.form.update(f => ({ ...f, [field]: value }));
    this.touch(field as any);
  }

  isFormValid(): boolean {
    const f = this.form();
    return (
      f.code.trim().length > 0 &&
      f.discountType > 0 &&
      f.discountValue > 0 &&
      f.usageLimit > 0 &&
      f.expiresAt.length > 0
    );
  }

  submit(): void {
    this.touched.set({ code: true, discountType: true, discountValue: true, usageLimit: true, expiresAt: true });

    if (!this.isFormValid()) {
      const f = this.form();
      if (!f.code.trim())        { this.error.set('Coupon code is required.'); return; }
      if (f.discountType <= 0)   { this.error.set('Please select a discount type.'); return; }
      if (f.discountValue <= 0)  { this.error.set('Discount value must be greater than 0.'); return; }
      if (f.usageLimit <= 0)     { this.error.set('Usage limit must be greater than 0.'); return; }
      if (!f.expiresAt)          { this.error.set('Expiry date is required.'); return; }
      return;
    }

    this.submitLoading.set(true);
    this.error.set(null);

    const id = this.editingId();
    const currentFormValue = this.form();
    const utcDate = new Date(currentFormValue.expiresAt).toISOString();

    const body: CreateCouponBody = {
      ...currentFormValue,
      discountType: Number(currentFormValue.discountType),
      expiresAt: utcDate
    };

    const request = this.isEditing() && id !== null
      ? this.couponsService.updateCoupon(id, body)
      : this.couponsService.createCoupon(body);

    request.subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.closeModal();
        this.loadCoupons();
      },
      error: (err) => {
        this.submitLoading.set(false);
        if (err?.status === 400) {
          this.error.set(this.extractApiError(err, 'Invalid data — please check the form fields'));
        } else if (err?.status === 409) {
          this.error.set('Coupon code already exists — please use a different code.');
        } else if (err?.status === 404 && this.isEditing()) {
          this.error.set('Coupon not found — it may have been deleted.');
        } else {
          this.error.set(this.extractApiError(err, 'Failed to save coupon'));
        }
      }
    });
  }

  confirmDelete(id: number): void {
    this.deletingId.set(id);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingId.set(null);
    this.error.set(null);
  }

  executeDelete(): void {
    const id = this.deletingId();
    if (id === null) return;

    this.deleteLoading.set(true);
    this.couponsService.deleteCoupon(id).subscribe({
      next: () => {
        this.deleteLoading.set(false);
        this.closeDeleteModal();
        this.loadCoupons();
      },
      error: (err) => {
        this.deleteLoading.set(false);
        if (err?.status === 404) {
          this.error.set('Coupon not found — it may have already been deleted.');
        } else {
          this.error.set(this.extractApiError(err, 'Failed to delete coupon'));
        }
      }
    });
  }

  toggle(id: number): void {
    this.coupons.update(list =>
      list.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
    this.couponsService.toggleCoupon(id).subscribe({
      error: (err) => {
        this.coupons.update(list =>
          list.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
        );
        if (err?.status === 404) {
          this.error.set('Coupon not found — refresh the page and try again.');
        } else {
          this.error.set(this.extractApiError(err, 'Failed to toggle coupon'));
        }
      }
    });
  }
}
