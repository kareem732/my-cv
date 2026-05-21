import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { COURSESService } from '../../../../../core/services/COURSES/courses.service';

interface SubCategory {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-course',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent implements OnInit {

  private fb        = inject(FormBuilder);
  private router    = inject(Router);
  private courseSvc = inject(COURSESService);

  isSubmitting = false;
  submitError: string | null = null;

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

  ngOnInit(): void {
    this.form = this.fb.group({
      title:            ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      description:      ['', [Validators.required, Validators.minLength(50)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      price:            [0,  [Validators.required, Validators.min(0)]],
      level:            [1,  [Validators.required]],
      language:         ['English', [Validators.required]],
      subCategoryId:    [null, [Validators.required]],
      requirements:     this.fb.array([this.fb.control('', Validators.required)]),
      whatYouLearn:     this.fb.array([this.fb.control('', Validators.required)])
    });
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
    this.thumbnailFile = null;
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
    this.submitError = null;

    const formData = new FormData();
    formData.append('Title',            this.form.value.title);
    formData.append('Description',      this.form.value.description);
    formData.append('ShortDescription', this.form.value.shortDescription);
    formData.append('Price',            String(+this.form.value.price));
    formData.append('Level',            String(+this.form.value.level));
    formData.append('Language',         this.form.value.language);
    formData.append('SubCategoryId',    String(Number(this.form.value.subCategoryId)));

    if (this.thumbnailFile) {
      formData.append('Thumbnail', this.thumbnailFile);
    }

    this.form.value.requirements
      .filter((r: string) => r.trim())
      .forEach((r: string) => formData.append('Requirements', r));

    this.form.value.whatYouLearn
      .filter((w: string) => w.trim())
      .forEach((w: string) => formData.append('WhatYouLearn', w));

    this.courseSvc.CreateCourse(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/instructor/my-courses']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.log('API ERROR:', err);
        this.submitError = 'Failed to create course. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/instructor/my-courses']);
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
