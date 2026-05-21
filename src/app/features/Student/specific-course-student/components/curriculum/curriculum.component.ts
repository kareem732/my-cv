import {
  Component, Input, OnInit, OnDestroy, inject, signal, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CurriculmService, Curriculum } from '../../../../../core/services/Curriculm/curriculm.service';
import { ProgressService } from '../../../../../core/services/progress/progress.service';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

@Component({
  selector: 'app-curriculum',
  imports: [CommonModule],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.css'
})
export class CurriculumComponent implements OnInit, OnDestroy {
  @Input() courseId!: number;

  private curriculumService = inject(CurriculmService);
  private progressService   = inject(ProgressService);
  private platformId        = inject(PLATFORM_ID);

  // ── State ─────────────────────────────────────────────────
  curriculum  = signal<Curriculum | null>(null);
  isLoading   = signal(true);
  error       = signal<string | null>(null);
  openSections = signal<Set<number>>(new Set());

  // ── Video ─────────────────────────────────────────────────
  videoTitle  = signal<string>('');
  isVideoOpen = signal(false);

  private ytPlayer: any = null;
  private watchInterval: any = null;
  private watchedMap   = new Map<number, number>();  // lessonId → watchedSeconds
  private completedSet = new Set<number>();           // lessons خلصت

  // ── Init ──────────────────────────────────────────────────
  ngOnInit(): void {
    this.curriculumService.getCurriculum(this.courseId).subscribe({
      next: (data) => {
        this.curriculum.set(data);
        if (data.sections.length > 0) {
          this.openSections.set(new Set([data.sections[0].id]));
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load curriculum.');
        this.isLoading.set(false);
      }
    });
  }

  // ── Sections ──────────────────────────────────────────────
  toggleSection(id: number): void {
    const current = new Set(this.openSections());
    current.has(id) ? current.delete(id) : current.add(id);
    this.openSections.set(current);
  }

  // ── Open Video ────────────────────────────────────────────
  openVideo(lessonId: number, url: string, title: string, totalSeconds: number): void {
    this.destroyPlayer();

    this.videoTitle.set(title);
    this.isVideoOpen.set(true);

    const videoId = this.extractYouTubeId(url);
    if (!videoId) return;

    setTimeout(() => this.initYTPlayer(videoId, lessonId, totalSeconds), 100);
  }

  // ── Close Video ───────────────────────────────────────────
  closeVideo(): void {
    this.destroyPlayer();
    this.isVideoOpen.set(false);
    this.videoTitle.set('');
  }

  // ── YouTube Player ────────────────────────────────────────
  private initYTPlayer(videoId: string, lessonId: number, totalSeconds: number): void {
    const createPlayer = () => {
      this.ytPlayer = new window.YT.Player('yt-player', {
        videoId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onStateChange: (event: any) =>
            this.onPlayerStateChange(event, lessonId, totalSeconds)
        }
      });
    };

    if (isPlatformBrowser(this.platformId)) {
      if (window.YT?.Player) {
        createPlayer();
      } else {
        if (!document.getElementById('yt-api-script')) {
          const tag = document.createElement('script');
          tag.id  = 'yt-api-script';
          tag.src = 'https://www.youtube.com/iframe_api';
          document.body.appendChild(tag);
        }
        window.onYouTubeIframeAPIReady = createPlayer;
      }
    }
  }

  private onPlayerStateChange(event: any, lessonId: number, totalSeconds: number): void {
    const YT_PLAYING = 1;
    const YT_PAUSED  = 2;
    const YT_ENDED   = 0;

    if (event.data === YT_PLAYING) {
      if (!this.completedSet.has(lessonId)) {
        this.startInterval(lessonId, totalSeconds);
      }
    } else if (event.data === YT_PAUSED) {
      this.stopInterval();
    } else if (event.data === YT_ENDED) {
      this.stopInterval();
      const watched = Math.round(this.ytPlayer?.getCurrentTime?.() ?? totalSeconds);
      this.sendWatchTime(lessonId, watched, totalSeconds);
    }
  }

  // ── Progress ──────────────────────────────────────────────
  private startInterval(lessonId: number, totalSeconds: number): void {
    this.stopInterval();
    this.watchInterval = setInterval(() => {
      if (this.completedSet.has(lessonId)) {
        this.stopInterval();
        return;
      }
      const current = this.watchedMap.get(lessonId) ?? 0;
      const updated = Math.min(current + 30, totalSeconds);
      this.watchedMap.set(lessonId, updated);
      this.sendWatchTime(lessonId, updated, totalSeconds);
    }, 30_000);
  }

  private stopInterval(): void {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
    }
  }

  private sendWatchTime(lessonId: number, watchedSeconds: number, totalSeconds: number): void {
    this.progressService.updateWatchTime(this.courseId, lessonId, {
      watchedSeconds,
      totalSeconds
    }).subscribe({
      next: (res) => {
        if (res.justCompleted || watchedSeconds >= totalSeconds) {
          this.completedSet.add(lessonId);
          this.stopInterval();
        }
      },
      error: (err) => console.error('watch time error:', err)
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  private destroyPlayer(): void {
    this.stopInterval();
    if (this.ytPlayer) {
      this.ytPlayer.destroy();
      this.ytPlayer = null;
    }
  }

  private extractYouTubeId(url: string): string | null {
    const m = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return m ? m[1] : null;
  }

  ngOnDestroy(): void {
    this.destroyPlayer();
  }
}
