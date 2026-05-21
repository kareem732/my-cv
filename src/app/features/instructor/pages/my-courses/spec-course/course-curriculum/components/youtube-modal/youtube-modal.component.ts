import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Lesson } from '../../../../../../../../core/services/Curriculm/curriculm.service';

@Component({
  selector: 'app-youtube-modal',
  standalone: true,
  templateUrl: './youtube-modal.component.html',
})
export class YoutubeModalComponent {
  private sanitizer = inject(DomSanitizer);

  @Input() lesson: Lesson | null = null;
  @Output() close = new EventEmitter<void>();

  get embedUrl(): SafeResourceUrl | null {
    if (!this.lesson?.videoUrl) return null;
    const id = this.extractId(this.lesson.videoUrl);
    if (!id) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?autoplay=1`
    );
  }

  private extractId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|[?&]v=|embed\/)([^&?/\s]{11})/);
    return match ? match[1] : '';
  }
}
