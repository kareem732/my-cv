import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/Admin/admin.guard';
import { authGuard } from './core/guards/Auth/auth.guard';
import { instructorGuard } from './core/guards/Instructor/instructor.guard';
import { studentGuard } from './core/guards/Student/student.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'about-us', pathMatch: 'full' },

  {
    path: 'about-us',
    loadComponent: () => import('../app/features/Student/about-us/about-us.component')
      .then(m => m.AboutUsComponent)
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('../app/features/admins/admin.component').then(m => m.AdminComponent),
    loadChildren: () => import('../app/core/routes/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  {
    path: 'instructor',
    canActivate: [instructorGuard],
    loadComponent: () => import('../app/features/instructor/instructor.component').then(m => m.InstructorComponent),
    loadChildren: () => import('../app/core/routes/instructor.routes').then(m => m.INSTRUCTOR_ROUTES)
  },

  {
    path: 'auth',
    canActivate: [authGuard],
    loadComponent: () => import('./core/auth/auth.component').then(m => m.AuthComponent),
    loadChildren: () => import('../app/core/routes/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
    path: 'student',
    canActivate: [studentGuard],
    loadComponent: () => import('../app/features/Student/student.component').then(m => m.StudentComponent),
    loadChildren: () => import('../app/core/routes/student.routes').then(m => m.STUDENT_ROUTES)
  },


  {
    path: 'server-error',
    loadComponent: () => import('../app/shared/layout/server-error/server-error.component').then(m => m.ServerErrorComponent)
  },
];
