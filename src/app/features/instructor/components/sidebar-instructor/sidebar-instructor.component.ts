import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-instructor',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-instructor.component.html',
  styleUrl: './sidebar-instructor.component.css'
})
export class SidebarInstructorComponent {
  logoutClicked = output<void>();
}
