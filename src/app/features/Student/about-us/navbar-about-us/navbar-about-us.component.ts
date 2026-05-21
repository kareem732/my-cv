import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/services/Theme/theme.service';

@Component({
  selector: 'app-navbar-about-us',
  standalone: true,
  imports: [CommonModule ,RouterLink],
  templateUrl: './navbar-about-us.component.html',
  styleUrl: './navbar-about-us.component.css'
})
export class NavbarAboutUsComponent {
  isScrolled = signal(false);
  public themeService = inject(ThemeService);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.scrollY || document.documentElement.scrollTop;
    if (scrollOffset > 50) {
      if (!this.isScrolled()) this.isScrolled.set(true);
    } else {
      if (this.isScrolled()) this.isScrolled.set(false);
    }
  }
}
