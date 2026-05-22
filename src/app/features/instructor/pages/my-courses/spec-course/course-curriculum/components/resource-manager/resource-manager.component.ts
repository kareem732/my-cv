import { Component, Input, OnInit, inject } from '@angular/core';  // ✅ add OnInit
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourcesService, Resource } from '../../../../../../../../core/services/Resources/resources.service';
import { environment2 } from '../../../../../../../../../app/core/environment/ENV'; // same path as your other services

@Component({
  selector: 'app-resource-manager',
  standalone: true,
  imports: [CommonModule, FormsModule , DecimalPipe],
  templateUrl: './resource-manager.component.html',
})
export class ResourceManagerComponent implements OnInit {  // ✅ implement OnInit
  @Input() courseId!: number;
  @Input() sectionId!: number;
  @Input() lessonId!: number;

  private resourcesService = inject(ResourcesService);

getFileUrl(fileUrl: string): string {
  if (fileUrl.startsWith('http')) return fileUrl;

  // Remove the /api suffix from baseUrl since files are served at root
  const serverRoot = environment2.baseUrl.replace(/\/api\/?$/, '');
  return serverRoot + fileUrl;
}
  resources: Resource[] = [];
  isLoading = false;
  isUploading = false;
  deletingId: number | null = null;
  errorMessage = '';

  newTitle = '';
  selectedFile: File | null = null;

  // ✅ only calls API if all 3 IDs are valid
  ngOnInit() {
    if (this.courseId && this.sectionId && this.lessonId) {
      this.loadResources();
    }
  }

  loadResources() {
    this.isLoading = true;
    this.errorMessage = '';
    this.resourcesService
      .getResources(this.courseId, this.sectionId, this.lessonId)
      .subscribe({
        next: (data) => {
          this.resources = data;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load resources.';
          this.isLoading = false;
        },
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    if (!this.newTitle && this.selectedFile) {
      this.newTitle = this.selectedFile.name.replace(/\.[^/.]+$/, '');
    }
  }

uploadProgress = 0;
private progressInterval: any = null;

upload() {
  if (!this.newTitle.trim() || !this.selectedFile || this.isUploading) return;

  this.isUploading = true;
  this.uploadProgress = 0;
  this.errorMessage = '';

  // ✅ simulate progress: fill to 90% over ~3s
  this.progressInterval = setInterval(() => {
    if (this.uploadProgress < 90) {
      this.uploadProgress += Math.random() * 8;
      if (this.uploadProgress > 90) this.uploadProgress = 90;
    }
  }, 300);

  this.resourcesService
    .addResource(this.courseId, this.sectionId, this.lessonId, this.newTitle.trim(), this.selectedFile)
    .subscribe({
      next: (resource) => {
        this.uploadProgress = 100; // ✅ jump to 100% on success
        clearInterval(this.progressInterval);

        setTimeout(() => {
          this.resources.push(resource);
          this.newTitle = '';
          this.selectedFile = null;
          this.isUploading = false;
          this.uploadProgress = 0;
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }, 400); // small delay so user sees 100%
      },
      error: () => {
        clearInterval(this.progressInterval);
        this.uploadProgress = 0;
        this.errorMessage = 'Upload failed. Please try again.';
        this.isUploading = false;
      },
    });
}

  delete(resourceId: number) {
    this.deletingId = resourceId;
    this.resourcesService
      .deleteResource(this.courseId, this.sectionId, this.lessonId, resourceId)
      .subscribe({
        next: () => {
          this.resources = this.resources.filter((r) => r.id !== resourceId);
          this.deletingId = null;
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = 'Delete failed.';
          this.deletingId = null;
        },
      });
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎬';
    if (fileType.includes('zip') || fileType.includes('rar')) return '🗜️';
    return '📁';
  }
}
