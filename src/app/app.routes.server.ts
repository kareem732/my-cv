import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'instructor/my-courses/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'student/courses/continue-learning/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'student/profile/my-learnings/course-learning/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
