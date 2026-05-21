import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { Lesson, LessonBody } from '../../../../../../../../../../../core/services/Curriculm/curriculm.service';
import { LessonFormComponent } from './lesson-form/lesson-form.component';

@Component({
  selector: 'app-lesson-item',
  standalone: true,
  imports: [NgClass, LessonFormComponent],
  templateUrl: './lesson-item.component.html',
})
export class LessonItemComponent {
  @Input() lesson!: Lesson;
  @Input() sectionId!: number;
  @Input() index!: number;
  @Input() isEditing = false;
  @Input() isSaving = false;
  @Input() editInitialData: LessonBody | null = null;
  @Input() draggedIndex: number | null = null;
  @Input() draggedSectionId: number | null = null;
  @Input() dragOverIndex: number | null = null;

  @Output() dragStart      = new EventEmitter<void>();
  @Output() dragOver       = new EventEmitter<DragEvent>();
  @Output() dragLeave      = new EventEmitter<void>();
  @Output() drop           = new EventEmitter<void>();
  @Output() dragEnd        = new EventEmitter<void>();
  @Output() editStart      = new EventEmitter<void>();
  @Output() editSave       = new EventEmitter<LessonBody>();
  @Output() editCancel     = new EventEmitter<void>();
  @Output() deletLesson    = new EventEmitter<void>();
  @Output() togglePreview  = new EventEmitter<void>();
  @Output() watchVideo     = new EventEmitter<void>();
}
