import { Routes } from '@angular/router';

export const INSTRUCTOR_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../../features/instructor/pages/dashboard/dashboard.component')
          .then(c => c.InstructorDashboardComponent)
      },
      {
        path: 'my-courses',
        children: [
          {
            path: '',
            loadComponent: () => import('../../features/instructor/pages/my-courses/my-courses.component')
              .then(c => c.MyCoursesComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('../../features/instructor/pages/my-courses/create-course/create-course.component')
              .then(c => c.CreateCourseComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('../../features/instructor/pages/my-courses/edit-course/edit-course.component')
              .then(c => c.EditCourseComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('../../features/instructor/pages/my-courses/spec-course/spec-course.component')
              .then(c => c.SpecCourseComponent)
          }
        ]
      },

      {
        path: 'reviews',
        loadComponent: () => import('../../features/instructor/pages/reviews/reviews.component')
          .then(c => c.ReviewsComponent)
      },
      {
        path: 'payout',
        loadComponent: () => import('../../features/instructor/pages/payout/payout.component')
          .then(c => c.PayoutComponent)
      }
    ]
  }
];
