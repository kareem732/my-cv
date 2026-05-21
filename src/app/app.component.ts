import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { initFlowbite } from 'flowbite';
import { ToastService } from './core/services/Toast/toast.service';
import { LoaderService } from './core/services/Loader/loader.service';
import { ToastComponent } from './shared/layout/toast/toast.component';
import { ThemeService } from './core/services/Theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Pro';
  public themeService = inject(ThemeService);

  public toastService = inject(ToastService);
  public loaderService = inject(LoaderService);

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const currentUrl = this.router.url.split('#')[0];
          const nextUrl = event.url.split('#')[0];

          if (currentUrl !== nextUrl) {
            this.loaderService.isLoading.set(true);
          }
        }

        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          setTimeout(() => {
            this.loaderService.isLoading.set(false);
          }, 200);
        }
      });

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        setTimeout(() => {
          initFlowbite();
        }, 0);
      });
    }
  }
}
