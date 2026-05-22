import { Component, output, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService, UserProfile } from '../../../../../../../../../core/services/Profile/profile.service';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.component.html',
})
export class ProfileFormComponent {
  private readonly _profileService = inject(ProfileService);
  private readonly _fb             = inject(FormBuilder);

  profileUpdated = output<UserProfile>();
  isSaving       = false;
  isPristine     = true;
  isInvalid      = true;

  form = this._fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    bio:       [''],
  });

  constructor() {
    effect(() => {
      const user = this._profileService.currentUser();
      if (user) {
        this.form.patchValue({
          firstName: user.firstName,
          lastName:  user.lastName,
          bio:       user.bio ?? '',
        });
        this.form.markAsPristine();
        this.isPristine = true;
        this.isInvalid  = this.form.invalid;
      }
    });

    this.form.statusChanges.subscribe(() => {
      this.isInvalid  = this.form.invalid;
    });

    this.form.valueChanges.subscribe(() => {
      this.isPristine = this.form.pristine;
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSaving = true;

    const body = {
      firstName: this.form.value.firstName!,
      lastName:  this.form.value.lastName!,
      bio:       this.form.value.bio ?? ''
    };

    this._profileService.updateProfile(body).subscribe({
      next: (updated) => {
        this.profileUpdated.emit(updated);
        this.isSaving   = false;
        this.isPristine = true;
        this.form.markAsPristine();
      },
      error: () => this.isSaving = false
    });
  }
}
