import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarStudentComponent } from './navbar-student/navbar-student.component';

@Component({
  selector: 'app-student',
  imports: [RouterOutlet, NavbarStudentComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
protected readonly router = inject(Router);
}
