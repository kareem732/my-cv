import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Section, LessonBody, Lesson } from '../../../../../../../../../../core/services/Curriculm/curriculm.service';
import { LessonFormComponent } from './lesson-item/lesson-form/lesson-form.component';
import { LessonItemComponent } from './lesson-item/lesson-item.component';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [LessonItemComponent, LessonFormComponent],
  templateUrl: './lesson-list.component.html',
})
export class LessonListComponent {
  @Input() section!: Section;
  @Input() courseId!: number;                                    // ✅ added
  @Input() editingLessonId: number | null = null;
  @Input() addingLessonToSectionId: number | null = null;
  @Input() isSavingLesson = false;
  @Input() editInitialData: LessonBody | null = null;
  @Input() draggedLessonIndex: number | null = null;
  @Input() draggedLessonSectionId: number | null = null;
  @Input() dragOverLessonIndex: number | null = null;

  @Output() lessonDragStart     = new EventEmitter<{ sectionId: number; index: number }>();
  @Output() lessonDragOver      = new EventEmitter<{ event: DragEvent; index: number }>();
  @Output() lessonDragLeave     = new EventEmitter<void>();
  @Output() lessonDrop          = new EventEmitter<{ sectionId: number; index: number }>();
  @Output() lessonDragEnd       = new EventEmitter<void>();
  @Output() editStart           = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() editSave            = new EventEmitter<{ sectionId: number; lessonId: number; body: LessonBody }>();
  @Output() editCancel          = new EventEmitter<void>();
  @Output() deleteLesson        = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() togglePreview       = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() watchVideo          = new EventEmitter<Lesson>();
  @Output() addLesson           = new EventEmitter<{ sectionId: number; body: LessonBody }>();
  @Output() cancelAddLesson     = new EventEmitter<void>();
  @Output() startAddLesson      = new EventEmitter<number>();
}
