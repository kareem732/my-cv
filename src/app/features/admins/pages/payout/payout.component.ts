import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Payout, PayoutAdminService } from '../../../../core/services/payoutAdmin/payout-admin.service';

@Component({
  selector: 'app-payout',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './payout.component.html',
  styleUrl: './payout.component.css',
})
export class PayoutComponent implements OnInit {
  private payoutService = inject(PayoutAdminService);

  payouts = signal<Payout[]>([]);
  loading = signal(false);
  selectedStatus = signal('ALL');
  search = signal('');

  approveNotes: { [key: number]: string } = {};
  rejectReasons: { [key: number]: string } = {};

  ngOnInit(): void {
    this.loadPayouts();
  }

  loadPayouts(): void {
    this.loading.set(true);
    this.payoutService.getAllPayouts().subscribe({
      next: (res) => {
        this.payouts.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  filteredPayouts = computed(() => {
    const status = this.selectedStatus();
    const search = this.search().toLowerCase();

    return this.payouts().filter((payout) => {
      const matchStatus =
        status === 'ALL' || payout.status.toLowerCase() === status.toLowerCase();

      const matchSearch =
        payout.instructorName.toLowerCase().includes(search) ||
        payout.id.toString().includes(search);

      return matchStatus && matchSearch;
    });
  });

  countByStatus(status: string): number {
    return this.payouts().filter(
      (p) => p.status.toLowerCase() === status.toLowerCase()
    ).length;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  setStatus(status: string): void {
    this.selectedStatus.set(status);
  }

  onSearch(value: string): void {
    this.search.set(value);
  }

  approve(payout: Payout): void {
    const notes = this.approveNotes[payout.id] || '';

    this.payoutService.approvePayout(payout.id, notes).subscribe({
      next: () => {
        this.payouts.update((payouts) =>
          payouts.map((p) =>
            p.id === payout.id ? { ...p, status: 'Approved', notes } : p
          )
        );
        delete this.approveNotes[payout.id];
        delete this.rejectReasons[payout.id];
      },
      error: (err) => console.error(err),
    });
  }

  reject(payout: Payout): void {
    const reason = this.rejectReasons[payout.id] || '';
    if (!reason.trim()) return;

    this.payoutService.rejectPayout(payout.id, reason).subscribe({
      next: () => {
        this.payouts.update((payouts) =>
          payouts.map((p) =>
            p.id === payout.id
              ? { ...p, status: 'Rejected', rejectionReason: reason }
              : p
          )
        );
        delete this.approveNotes[payout.id];
        delete this.rejectReasons[payout.id];
      },
      error: (err) => console.error(err),
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending':  return 'bg-amber-100 text-amber-700';
      case 'rejected': return 'bg-red-100 text-red-600';
      default:         return 'bg-gray-100 text-gray-500';
    }
  }
}
