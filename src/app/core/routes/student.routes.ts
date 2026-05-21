import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () => import('../../features/Student/home/home.component')
      .then(m => m.HomeComponent)
  },

  {
    path: 'checkout',
    loadComponent: () => import('../../features/Student/checkout/checkout.component')
      .then(m => m.CheckoutComponent)
  },

  {
    path: 'payment',
    loadComponent: () => import('../../features/Student/payment/payment.component')
      .then(m => m.PaymentComponent)
  },

  {
    path: 'payment/result',
    loadComponent: () => import('../../features/Student/payment/components/success-or-fail/success-or-fail.component')
      .then(m => m.SuccessOrFailComponent)
  },

  {
    path: 'courses',
    children: [
      {
        path: '',
        loadComponent: () => import('../../features/Student/home/components/courses/courses.component')
          .then(m => m.CoursesComponent)
      },
      {
        path: 'continue-learning/:id',
        loadComponent: () => import('../../features/Student/specific-course-student/components/continue-learning/continue-learning.component')
          .then(m => m.ContinueLearningComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('../../features/Student/specific-course-student/specific-course-student.component')
          .then(m => m.SpecificCourseStudentComponent)
      },
    ]
  },

  {
    path: 'profile',
    loadComponent: () => import('../../features/Student/profile/profile.component')
      .then(m => m.ProfileComponent),
    children: [
      { path: '', redirectTo: 'my-learnings', pathMatch: 'full' },
      {
        path: 'my-profile',
        loadComponent: () => import('../../features/Student/profile/components/sidebar/components/my-profile/my-profile.component')
          .then(m => m.MyProfileComponent)
      },
      {
        path: 'my-certificates',
        loadComponent: () => import('../../features/Student/profile/components/sidebar/components/my-certificates/my-certificates.component')
          .then(m => m.MyCertificatesComponent)
      },
      {
        path: 'my-learnings',
        loadComponent: () => import('../../features/Student/profile/components/sidebar/components/my-learnings/my-learnings.component')
          .then(m => m.MyLearningsComponent),
        children: [
          {
            path: 'course-learning/:id',
            loadComponent: () => import('../../features/Student/profile/components/sidebar/components/my-learnings/components/course-learning/course-learning.component')
              .then(m => m.CourseLearningComponent)
          }
        ]
      },
    ]
  },

  {
    path: 'wishlist',
    loadComponent: () => import('../../features/Student/wishlist/wishlist.component')
      .then(m => m.WishlistComponent)
  }
];
