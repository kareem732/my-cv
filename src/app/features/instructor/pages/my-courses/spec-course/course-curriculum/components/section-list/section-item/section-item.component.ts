import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Section, LessonBody, Lesson } from '../../../../../../../../../core/services/Curriculm/curriculm.service';
import { LessonListComponent } from './lesson-list/lesson-list.component';

@Component({
  selector: 'app-section-item',
  standalone: true,
  imports: [NgClass, FormsModule, LessonListComponent],
  templateUrl: './section-item.component.html',
})
export class SectionItemComponent implements OnChanges {
  @Input() section!: Section;
  @Input() index!: number;
  @Input() courseId!: number;                                    // ✅ added
  @Input() isExpanded = false;
  @Input() isEditingSection = false;
  @Input() isSavingSection = false;
  @Input() editingTitle = '';
  @Input() draggedSectionIndex: number | null = null;
  @Input() dragOverSectionIndex: number | null = null;
  @Input() editingLessonId: number | null = null;
  @Input() addingLessonToSectionId: number | null = null;
  @Input() isSavingLesson = false;
  @Input() lessonEditInitialData: LessonBody | null = null;
  @Input() draggedLessonIndex: number | null = null;
  @Input() draggedLessonSectionId: number | null = null;
  @Input() dragOverLessonIndex: number | null = null;

  @Output() toggle             = new EventEmitter<void>();
  @Output() sectionDragStart   = new EventEmitter<void>();
  @Output() sectionDragOver    = new EventEmitter<DragEvent>();
  @Output() sectionDragLeave   = new EventEmitter<void>();
  @Output() sectionDrop        = new EventEmitter<void>();
  @Output() sectionDragEnd     = new EventEmitter<void>();
  @Output() editSectionStart   = new EventEmitter<void>();
  @Output() editSectionSave    = new EventEmitter<string>();
  @Output() editSectionCancel  = new EventEmitter<void>();
  @Output() deleteSection      = new EventEmitter<void>();
  @Output() startAddLesson     = new EventEmitter<void>();

  @Output() lessonDragStart        = new EventEmitter<{ sectionId: number; index: number }>();
  @Output() lessonDragOver         = new EventEmitter<{ event: DragEvent; index: number }>();
  @Output() lessonDragLeave        = new EventEmitter<void>();
  @Output() lessonDrop             = new EventEmitter<{ sectionId: number; index: number }>();
  @Output() lessonDragEnd          = new EventEmitter<void>();
  @Output() lessonEditStart        = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() lessonEditSave         = new EventEmitter<{ sectionId: number; lessonId: number; body: LessonBody }>();
  @Output() lessonEditCancel       = new EventEmitter<void>();
  @Output() deleteLesson           = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() togglePreview          = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() watchVideo             = new EventEmitter<Lesson>();
  @Output() addLesson              = new EventEmitter<{ sectionId: number; body: LessonBody }>();
  @Output() cancelAddLesson        = new EventEmitter<void>();
  @Output() startAddLessonFromList = new EventEmitter<number>();

  localTitle = '';

  ngOnChanges() {
    if (this.isEditingSection) {
      this.localTitle = this.editingTitle;
    }
  }
}
