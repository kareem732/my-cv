import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './section-form.component.html',
})
export class SectionFormComponent {
  @Input() isSaving = false;
  @Output() save   = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  title = '';

  focus() {
    setTimeout(() => this.inputRef?.nativeElement?.focus(), 50);
  }

  submit() {
    if (!this.title.trim() || this.isSaving) return;
    this.save.emit(this.title.trim());
    this.title = '';
  }
}
