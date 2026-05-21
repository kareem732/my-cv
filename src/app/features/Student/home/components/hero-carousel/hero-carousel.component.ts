import { Component, AfterViewInit } from '@angular/core';

declare const Flowbite: any;

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [],
  templateUrl: './hero-carousel.component.html',
})
export class HeroCarouselComponent implements AfterViewInit {
  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        import('flowbite').then(({ initCarousels }) => {
          initCarousels();
        });
      }, 100);
    }
  }
}
