import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/Theme/theme.service';

@Component({
  selector: 'app-navbar-instructor',
  imports: [],
  templateUrl: './navbar-instructor.component.html',
  styleUrl: './navbar-instructor.component.css'
})
export class NavbarInstructorComponent {
  themeService = inject(ThemeService);
}
