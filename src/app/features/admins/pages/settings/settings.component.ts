import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, ViewportScroller } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlatformSettings, SettingsService } from '../../../../core/services/settings/settings.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, RouterLink, NgClass],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {

  private settingsService = inject(SettingsService);
  private fragmentSub!: Subscription;

  activeFragment = 'general';

  settings: PlatformSettings = {
    name: '',
    description: '',
    logoUrl: '',
    faviconUrl: '',
    currency: 'USD',
    language: 'en',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    workingHours: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedIn: '',
    youtube: '',
    metaTitle: '',
    metaDescription: '',
    allowRegister: false,
    maintenanceMode: false,
    allowGoogleLogin: false,
    allowSubscription: false,
  };

  isSaving = false;
  saveSuccess = false;

  constructor(
    private scroller: ViewportScroller,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: (data) => (this.settings = data),
      error: (err) => console.error('Failed to load settings', err),
    });

    this.fragmentSub = this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.activeFragment = fragment;
        setTimeout(() => this.scroller.scrollToAnchor(fragment), 50);
      }
    });
  }

  ngOnDestroy(): void {
    this.fragmentSub?.unsubscribe();
  }

  save(): void {
    this.isSaving = true;
    this.settingsService.updateSettings(this.settings).subscribe({
      next: (updated) => {
        this.settings = updated;
        this.isSaving = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: (err) => {
        console.error('Failed to save settings', err);
        this.isSaving = false;
      },
    });
  }

  discard(): void {
    this.ngOnInit();
  }
}
