import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  templateUrl: './delete-modal.component.html',
})
export class DeleteModalComponent {
  @Input() isOpen = false;
  @Input() isLoading = false;
  @Input() targetType: 'section' | 'lesson' | '' = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() close   = new EventEmitter<void>();
}
