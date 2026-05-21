import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/Theme/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  themeService = inject(ThemeService);

}
