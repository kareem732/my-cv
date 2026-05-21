import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SectionFormComponent } from '../section-form/section-form.component';
import { Curriculum, LessonBody, Section, Lesson } from '../../../../../../../../core/services/Curriculm/curriculm.service';
import { SectionItemComponent } from './section-item/section-item.component';

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [ SectionItemComponent, SectionFormComponent],
  templateUrl: './section-list.component.html',
})
export class SectionListComponent {
  @Input() curriculum!: Curriculum;
  @Input() expandedSections = new Set<number>();
  @Input() editingSectionId: number | null = null;
  @Input() editingSectionTitle = '';
  @Input() isSavingSection = false;
  @Input() isAddingSection = false;
  @Input() editingLessonId: number | null = null;
  @Input() addingLessonToSectionId: number | null = null;
  @Input() isSavingLesson = false;
  @Input() lessonEditInitialData: LessonBody | null = null;
  @Input() draggedSectionIndex: number | null = null;
  @Input() dragOverSectionIndex: number | null = null;
  @Input() draggedLessonIndex: number | null = null;
  @Input() draggedLessonSectionId: number | null = null;
  @Input() dragOverLessonIndex: number | null = null;

  @Output() toggleSection      = new EventEmitter<number>();
  @Output() sectionDragStart   = new EventEmitter<number>();
  @Output() sectionDragOver    = new EventEmitter<{ event: DragEvent; index: number }>();
  @Output() sectionDragLeave   = new EventEmitter<void>();
  @Output() sectionDrop        = new EventEmitter<number>();
  @Output() sectionDragEnd     = new EventEmitter<void>();
  @Output() editSectionStart   = new EventEmitter<Section>();
  @Output() editSectionSave    = new EventEmitter<{ section: Section; title: string }>(); // ✅ تغير هنا
  @Output() editSectionCancel  = new EventEmitter<void>();
  @Output() deleteSection      = new EventEmitter<Section>();
  @Output() startAddLesson     = new EventEmitter<number>();
  @Output() addSectionSave     = new EventEmitter<string>();
  @Output() addSectionCancel   = new EventEmitter<void>();
  @Output() startAddSection    = new EventEmitter<void>();

  @Output() lessonDragStart    = new EventEmitter<{ sectionId: number; index: number }>();
  @Output() lessonDragOver     = new EventEmitter<{ event: DragEvent; index: number }>();
  @Output() lessonDragLeave    = new EventEmitter<void>();
  @Output() lessonDrop         = new EventEmitter<{ sectionId: number; index: number }>();
  @Output() lessonDragEnd      = new EventEmitter<void>();
  @Output() lessonEditStart    = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() lessonEditSave     = new EventEmitter<{ sectionId: number; lessonId: number; body: LessonBody }>();
  @Output() lessonEditCancel   = new EventEmitter<void>();
  @Output() deleteLesson       = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() togglePreview      = new EventEmitter<{ sectionId: number; lesson: Lesson }>();
  @Output() watchVideo         = new EventEmitter<Lesson>();
  @Output() addLesson          = new EventEmitter<{ sectionId: number; body: LessonBody }>();
  @Output() cancelAddLesson    = new EventEmitter<void>();
}
