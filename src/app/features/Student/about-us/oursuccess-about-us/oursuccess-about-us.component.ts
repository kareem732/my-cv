import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-oursuccess-about-us',
  standalone: true,
  templateUrl: './oursuccess-about-us.component.html',
  styleUrl: './oursuccess-about-us.component.css'
})
export class OursuccessAboutUsComponent implements AfterViewInit {
  @ViewChildren('count') countElements!: QueryList<ElementRef>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observerOptions = {
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const targetValue = parseInt(el.getAttribute('data-target') || '0', 10);
            const suffix = el.getAttribute('data-suffix') || '';
            this.animateNumber(el, targetValue, suffix);
            observer.unobserve(el);
          }
        });
      }, observerOptions);

      this.countElements.forEach(item => observer.observe(item.nativeElement));
    }
  }

  private animateNumber(element: HTMLElement, target: number, suffix: string) {
    const duration = 2000;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutValue = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(easeOutValue * target);

      element.innerText = currentNumber.toLocaleString() + (progress === 1 ? suffix : '');

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }
}
