import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CourseDetails, COURSESService } from '../../../../../core/services/COURSES/courses.service';

interface SubCategory {
  id: number;
  name: string;
}

@Component({
  selector: 'app-edit-course',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit {

  private fb        = inject(FormBuilder);
  private router    = inject(Router);
  private route     = inject(ActivatedRoute);
  private courseSvc = inject(COURSESService);

  courseId!: number;
  course: CourseDetails | null = null;
  isLoading    = true;
  isSubmitting = false;
  loadError:   string | null = null;
  submitError: string | null = null;
  successMsg:  string | null = null;

  thumbnailFile: File | null = null;
  thumbnailPreview: string | null = null;

  levels = [
    { value: 1, label: 'Beginner' },
    { value: 2, label: 'Intermediate' },
    { value: 3, label: 'Advanced' }
  ];

  languages = ['English', 'Arabic', 'French', 'Spanish', 'German'];

  subCategories: SubCategory[] = [
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'Mobile Development' },
    { id: 3, name: 'Data Science' },
    { id: 4, name: 'UI/UX Design' },
    { id: 5, name: 'DevOps' }
  ];

  form!: FormGroup;

  private levelMap: Record<string, number> = {
    Beginner: 1, Intermediate: 2, Advanced: 3
  };

  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadCourse();
  }

  private initForm(): void {
    this.form = this.fb.group({
      title:            ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      description:      ['', [Validators.required, Validators.minLength(20)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      price:            [0,  [Validators.required, Validators.min(0)]],
      discountPrice:    [0,  [Validators.min(0)]],
      level:            [1,  [Validators.required]],
      language:         ['English', [Validators.required]],
      subCategoryId:    [null, [Validators.required]],
      requirements:     this.fb.array([this.fb.control('', Validators.required)]),
      whatYouLearn:     this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  private loadCourse(): void {
    this.isLoading = true;
    this.loadError = null;

    this.courseSvc.GetCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course    = course;
        this.isLoading = false;
        this.patchForm(course);
      },
      error: () => {
        this.loadError = 'Failed to load course data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private patchForm(course: CourseDetails): void {
    this.thumbnailFile    = null;
    this.thumbnailPreview = this.getThumbnailUrl(course.thumbnailUrl);

    this.requirements.clear();
    (course.requirements?.length ? course.requirements : ['']).forEach(r =>
      this.requirements.push(this.fb.control(r, Validators.required))
    );

    this.whatYouLearn.clear();
    (course.whatYouLearn?.length ? course.whatYouLearn : ['']).forEach(w =>
      this.whatYouLearn.push(this.fb.control(w, Validators.required))
    );

    this.form.patchValue({
      title:            course.title,
      shortDescription: course.shortDescription,
      description:      course.description,
      price:            course.price,
      discountPrice:    course.discountPrice ?? 0,
      level:            this.levelMap[course.level] ?? 1,
      language:         course.language,
      subCategoryId:    course.subCategoryId
    });
  }

  getThumbnailUrl(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }

  onThumbnailChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.thumbnailFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.thumbnailFile);
    }
  }

  removeThumbnail(): void {
    this.thumbnailFile    = null;
    this.thumbnailPreview = null;
  }

  get requirements(): FormArray {
    return this.form.get('requirements') as FormArray;
  }

  get whatYouLearn(): FormArray {
    return this.form.get('whatYouLearn') as FormArray;
  }

  addRequirement(): void {
    this.requirements.push(this.fb.control('', Validators.required));
  }

  removeRequirement(index: number): void {
    if (this.requirements.length > 1) this.requirements.removeAt(index);
  }

  addWhatYouLearn(): void {
    this.whatYouLearn.push(this.fb.control('', Validators.required));
  }

  removeWhatYouLearn(index: number): void {
    if (this.whatYouLearn.length > 1) this.whatYouLearn.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError  = null;
    this.successMsg   = null;

    const formData = new FormData();
    formData.append('Title',            this.form.value.title);
    formData.append('Description',      this.form.value.description);
    formData.append('ShortDescription', this.form.value.shortDescription);
    formData.append('Price',            String(+this.form.value.price));
    formData.append('DiscountPrice',    String(+this.form.value.discountPrice));
    formData.append('Level',            String(+this.form.value.level));
    formData.append('Language',         this.form.value.language);
    formData.append('SubCategoryId',    String(+this.form.value.subCategoryId));

    if (this.thumbnailFile) {
      formData.append('Thumbnail', this.thumbnailFile);
    }

    this.form.value.requirements
      .filter((r: string) => r.trim())
      .forEach((r: string) => formData.append('Requirements', r));

    this.form.value.whatYouLearn
      .filter((w: string) => w.trim())
      .forEach((w: string) => formData.append('WhatYouLearn', w));

    this.courseSvc.UpdateCourse(this.courseId, formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMsg   = 'Course updated successfully!';
        setTimeout(() => this.successMsg = null, 3000);
        this.router.navigate(['/instructor/my-courses']);
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError  = 'Failed to update course. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/instructor/my-courses']);
  }

  retryLoad(): void {
    this.loadCourse();
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
