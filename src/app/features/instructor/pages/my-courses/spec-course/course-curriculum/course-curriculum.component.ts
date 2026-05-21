import {
  Component, Input, Output, EventEmitter,
  OnInit, DestroyRef, inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {
  CurriculmService,
  Curriculum, Section, Lesson, LessonBody
} from '../../../../../../core/services/Curriculm/curriculm.service';
import { CurriculumStatsComponent } from './components/curriculum-stats/curriculum-stats.component';
import { SectionListComponent } from './components/section-list/section-list.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { YoutubeModalComponent } from './components/youtube-modal/youtube-modal.component';

@Component({
  selector: 'app-course-curriculum',
  standalone: true,
  imports: [CommonModule, CurriculumStatsComponent, SectionListComponent, DeleteModalComponent, YoutubeModalComponent],
  templateUrl: './course-curriculum.component.html',
})
export class CourseCurriculumComponent implements OnInit {

  @Input() courseId!: number;
  @Output() curriculumLoaded = new EventEmitter<Curriculum>();

  private curriculumSvc = inject(CurriculmService);
  private destroyRef    = inject(DestroyRef);

  isDeleteModalOpen = false;
  isDeleteLoading = false;
  deleteTargetType: 'section' | 'lesson' | '' = '';
  selectedSectionId: number | null = null;
  selectedLessonId: number | null = null;

  youTubelesson: Lesson | null = null;

  curriculum: Curriculum | null = null;
  isLoading = false;
  error: string | null = null;
  expandedSections = new Set<number>();

  isAddingSection = false;
  isSavingSection = false;
  editingSectionId: number | null = null;
  editingSectionTitle = '';

  addingLessonToSectionId: number | null = null;
  editingLessonId: number | null = null;
  editingLessonSectionId: number | null = null;
  isSavingLesson = false;
  lessonForm: LessonBody = this.emptyLessonForm();

  draggedSectionIndex: number | null = null;
  dragOverSectionIndex: number | null = null;
  draggedLessonIndex: number | null = null;
  draggedLessonSectionId: number | null = null;
  dragOverLessonIndex: number | null = null;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.error = null;
    const prev = new Set(this.expandedSections);
    this.curriculumSvc.getCurriculum(this.courseId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.curriculum = data;
          if (prev.size === 0 && data.sections.length > 0) {
            this.expandedSections.add(data.sections[0].id);
          } else {
            this.expandedSections = new Set(data.sections.map(s => s.id).filter(id => prev.has(id)));
          }
          this.isLoading = false;
          this.curriculumLoaded.emit(data);
        },
        error: () => { this.error = 'Failed to load curriculum.'; this.isLoading = false; }
      });
  }

  onDeleteSection(section: Section) {
    this.deleteTargetType = 'section';
    this.selectedSectionId = section.id;
    this.selectedLessonId = null;
    this.isDeleteModalOpen = true;
  }

  onDeleteLesson(e: { sectionId: number; lesson: Lesson }) {
    this.deleteTargetType = 'lesson';
    this.selectedSectionId = e.sectionId;
    this.selectedLessonId = e.lesson.id;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (this.isDeleteLoading) return;
    this.isDeleteLoading = true;
    if (this.deleteTargetType === 'section' && this.selectedSectionId) {
      this.curriculumSvc.deleteSection(this.courseId, this.selectedSectionId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            if (this.curriculum) {
              this.curriculum.sections = this.curriculum.sections.filter(s => s.id !== this.selectedSectionId);
              this.curriculum.totalSections--;
            }
            this.closeDeleteModal();
          },
          error: () => this.isDeleteLoading = false
        });
    }
    if (this.deleteTargetType === 'lesson' && this.selectedLessonId && this.selectedSectionId) {
      this.curriculumSvc.deleteLesson(this.courseId, this.selectedSectionId, this.selectedLessonId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            const section = this.curriculum?.sections.find(s => s.id === this.selectedSectionId);
            if (section) { section.lessons = section.lessons.filter(l => l.id !== this.selectedLessonId); section.lessonCount--; }
            if (this.curriculum) this.curriculum.totalLessons--;
            this.closeDeleteModal();
          },
          error: () => this.isDeleteLoading = false
        });
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.isDeleteLoading = false;
    this.deleteTargetType = '';
    this.selectedSectionId = null;
    this.selectedLessonId = null;
  }

  onWatchVideo(lesson: Lesson) { this.youTubelesson = lesson; }
  closeYouTubeModal() { this.youTubelesson = null; }

  toggleSection(id: number) {
    this.expandedSections.has(id) ? this.expandedSections.delete(id) : this.expandedSections.add(id);
  }

  startAddSection() { this.isAddingSection = true; }

  onAddSectionSave(title: string) {
    this.isSavingSection = true;
    this.curriculumSvc.addSection(this.courseId, { title })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (section) => {
          this.curriculum?.sections.push(section);
          if (this.curriculum) this.curriculum.totalSections++;
          this.expandedSections.add(section.id);
          this.isAddingSection = false;
          this.isSavingSection = false;
        },
        error: () => this.isSavingSection = false
      });
  }

  onEditSectionStart(section: Section) {
    this.editingSectionId = section.id;
    this.editingSectionTitle = section.title;
  }

  // ✅ التغيير الرئيسي هنا — بيستقبل { section, title } بدل Section بس
  onEditSectionSave(e: { section: Section; title: string }) {
    if (!e.title.trim() || this.isSavingSection) return;
    this.isSavingSection = true;
    this.curriculumSvc.updateSection(this.courseId, e.section.id, { title: e.title.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          e.section.title = updated.title;
          this.editingSectionId = null;
          this.isSavingSection = false;
        },
        error: () => this.isSavingSection = false
      });
  }

  startAddLesson(sectionId: number) {
    this.expandedSections.add(sectionId);
    this.addingLessonToSectionId = sectionId;
    this.editingLessonId = null;
    this.lessonForm = this.emptyLessonForm();
  }

  onAddLesson(e: { sectionId: number; body: LessonBody }) {
    this.isSavingLesson = true;
    this.curriculumSvc.addLesson(this.courseId, e.sectionId, e.body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.addingLessonToSectionId = null;
          this.isSavingLesson = false;
          this.expandedSections.add(e.sectionId);
          this.load();
        },
        error: () => this.isSavingLesson = false
      });
  }

  onLessonEditStart(e: { sectionId: number; lesson: Lesson }) {
    this.editingLessonId = e.lesson.id;
    this.editingLessonSectionId = e.sectionId;
    this.addingLessonToSectionId = null;
    this.lessonForm = {
      title: e.lesson.title,
      description: e.lesson.description,
      videoUrl: e.lesson.videoUrl,
      durationInSeconds: e.lesson.durationInSeconds,
      type: this.typeStringToNumber(e.lesson.type),
      isFreePreview: e.lesson.isFreePreview
    };
  }

  onLessonEditSave(e: { sectionId: number; lessonId: number; body: LessonBody }) {
    this.isSavingLesson = true;
    this.curriculumSvc.updateLesson(this.courseId, e.sectionId, e.lessonId, e.body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.editingLessonId = null;
          this.editingLessonSectionId = null;
          this.isSavingLesson = false;
          this.expandedSections.add(e.sectionId);
          this.load();
        },
        error: () => this.isSavingLesson = false
      });
  }

  onTogglePreview(e: { sectionId: number; lesson: Lesson }) {
    this.curriculumSvc.toggleFreePreview(this.courseId, e.sectionId, e.lesson.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          e.lesson.isFreePreview = !e.lesson.isFreePreview;
          if (this.curriculum) this.curriculum.freePreviewCount += e.lesson.isFreePreview ? 1 : -1;
        }
      });
  }

  onSectionDragStart(index: number) { this.draggedSectionIndex = index; }
  onSectionDragOver(e: { event: DragEvent; index: number }) { e.event.preventDefault(); this.dragOverSectionIndex = e.index; }
  onSectionDragLeave() { this.dragOverSectionIndex = null; }
  onSectionDrop(targetIndex: number) {
    if (this.draggedSectionIndex === null || !this.curriculum) return;
    const sections = this.curriculum.sections;
    const dragged = sections.splice(this.draggedSectionIndex, 1)[0];
    sections.splice(targetIndex, 0, dragged);
    sections.forEach((s, i) => s.order = i + 1);
    this.curriculumSvc.reorderSections(this.courseId, { items: sections.map(s => ({ sectionId: s.id, order: s.order })) })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => this.load() });
    this.draggedSectionIndex = null;
    this.dragOverSectionIndex = null;
  }
  onSectionDragEnd() { this.draggedSectionIndex = null; this.dragOverSectionIndex = null; }

  onLessonDragStart(e: { sectionId: number; index: number }) { this.draggedLessonIndex = e.index; this.draggedLessonSectionId = e.sectionId; }
  onLessonDragOver(e: { event: DragEvent; index: number }) { e.event.preventDefault(); this.dragOverLessonIndex = e.index; }
  onLessonDragLeave() { this.dragOverLessonIndex = null; }
  onLessonDrop(e: { sectionId: number; index: number }) {
    if (this.draggedLessonIndex === null) return;
    const section = this.curriculum?.sections.find(s => s.id === e.sectionId);
    if (!section) return;
    const lessons = section.lessons;
    const dragged = lessons.splice(this.draggedLessonIndex, 1)[0];
    lessons.splice(e.index, 0, dragged);
    lessons.forEach((l, i) => l.order = i + 1);
    this.curriculumSvc.reorderLessons(this.courseId, e.sectionId, { items: lessons.map(l => ({ lessonId: l.id, order: l.order })) })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => this.load() });
    this.draggedLessonIndex = null;
    this.draggedLessonSectionId = null;
    this.dragOverLessonIndex = null;
  }
  onLessonDragEnd() { this.draggedLessonIndex = null; this.draggedLessonSectionId = null; this.dragOverLessonIndex = null; }

  private emptyLessonForm(): LessonBody {
    return { title: '', description: '', videoUrl: '', durationInSeconds: 0, type: 1, isFreePreview: false };
  }

  private typeStringToNumber(type: string): number {
    switch (type?.toLowerCase()) {
      case 'video': return 1;
      case 'article': return 2;
      default: return 3;
    }
  }
}
