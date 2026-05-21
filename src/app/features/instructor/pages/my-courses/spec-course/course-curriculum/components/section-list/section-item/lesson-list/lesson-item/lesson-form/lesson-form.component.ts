import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LessonBody } from '../../../../../../../../../../../../core/services/Curriculm/curriculm.service';

@Component({
  selector: 'app-lesson-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lesson-form.component.html',
})
export class LessonFormComponent implements OnChanges {
  @Input() isSaving = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() initialData: LessonBody | null = null;

  @Output() save   = new EventEmitter<LessonBody>();
  @Output() cancel = new EventEmitter<void>();

  form: LessonBody = this.empty();

  ngOnChanges() {
    this.form = this.initialData ? { ...this.initialData } : this.empty();
  }

  submit() {
    if (!this.form.title.trim() || this.isSaving) return;
    this.save.emit({ ...this.form, type: Number(this.form.type) });
  }

  private empty(): LessonBody {
    return { title: '', description: '', videoUrl: '', durationInSeconds: 0, type: 1, isFreePreview: false };
  }
}
