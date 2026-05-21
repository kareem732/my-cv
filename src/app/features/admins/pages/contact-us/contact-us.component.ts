import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  ContactMessage,
  ContactUsService
} from '../../../../core/services/ContactUs/contact-us.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
})
export class ContactUsComponent implements OnInit {

  private contactService = inject(ContactUsService);


  allMessages   = signal<ContactMessage[]>([]);
  messages      = signal<ContactMessage[]>([]);
  selectedMessage = signal<ContactMessage | null>(null);

  currentFilter = signal<'all' | 'new' | 'replied'>('all');

  isLoading         = signal<boolean>(false);
  isSubmittingReply = signal<boolean>(false);

  errorMessage = signal<string | null>(null);

  replyText = signal<string>('');


  ngOnInit(): void {
    this.loadMessages();
  }


  loadMessages(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.selectedMessage.set(null);

    this.contactService.getContacts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.allMessages.set(data);
          this.applyFilter(this.currentFilter());
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Failed to load messages from server.');
        }
      });
  }

  applyFilter(filter: 'all' | 'new' | 'replied'): void {
    this.currentFilter.set(filter);
    this.selectedMessage.set(null);

    const all = this.allMessages();

    if (filter === 'new') {
      this.messages.set(all.filter(m => !m.adminReply));
    } else if (filter === 'replied') {
      this.messages.set(all.filter(m => !!m.adminReply));
    } else {
      this.messages.set(all);
    }
  }


  selectMessage(msg: ContactMessage): void {
    this.selectedMessage.set(msg);
    this.replyText.set(msg.adminReply || '');
  }


  submitReply(): void {
    const activeMsg     = this.selectedMessage();
    const replyContent  = this.replyText().trim();

    if (!activeMsg || !replyContent || this.isSubmittingReply()) return;

    this.isSubmittingReply.set(true);

    this.contactService
      .replyToContact(activeMsg.id, replyContent)
      .pipe(finalize(() => this.isSubmittingReply.set(false)))
      .subscribe({
        next: () => {
          this.allMessages.update(all =>
            all.map(m =>
              m.id === activeMsg.id
                ? { ...m, adminReply: replyContent }
                : m
            )
          );

          this.applyFilter(this.currentFilter());

          this.selectedMessage.set({
            ...activeMsg,
            adminReply: replyContent
          });

          this.replyText.set('');
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Failed to send reply. Please try again.');
        }
      });
  }
}
