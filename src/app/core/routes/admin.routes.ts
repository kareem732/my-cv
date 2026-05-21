import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../../features/admins/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('../../features/admins/pages/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('../../features/admins/pages/courses/courses.component').then(m => m.CoursesComponent)
      },
      {
        path: 'contact-us',
        loadComponent: () => import('../../features/admins/pages/contact-us/contact-us.component').then(m => m.ContactUsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('../../features/admins/pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'copons',
        loadComponent: () => import('../../features/admins/pages/copons/copons.component').then(m => m.CoponsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('../../features/admins/pages/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'payout',
        loadComponent: () => import('../../features/admins/pages/payout/payout.component').then(m => m.PayoutComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('../../features/admins/pages/reviews/reviews.component').then(m => m.AdminReviewsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
