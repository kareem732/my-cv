<div align="center">

<svg width="80" height="80" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
  <polygon points="70,8 118,35 118,90 70,117 22,90 22,35" fill="#4A3ADF"/>
  <rect x="48" y="38" width="9" height="64" rx="4" fill="white"/>
  <line x1="57" y1="70" x2="88" y2="39" stroke="white" stroke-width="9" stroke-linecap="round"/>
  <line x1="57" y1="70" x2="88" y2="101" stroke="white" stroke-width="9" stroke-linecap="round"/>
  <circle cx="112" cy="35" r="12" fill="#F97316"/>
</svg>

# Knovia — E-Learning Platform

**A full-featured, multi-role Learning Management System built with Angular 19**

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google-OAuth_2.0-4285F4?style=for-the-badge&logo=google&logoColor=white)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Authentication Flow](#authentication-flow)
- [Role System](#role-system)
- [Dashboards](#dashboards)
- [Payment Integration](#payment-integration)
- [HTTP Interceptors](#http-interceptors)
- [Screenshots](#screenshots)

---

## 🌟 Overview

Knovia is a production-ready E-Learning Platform supporting three distinct roles — **Student**, **Instructor**, and **Admin** — each with their own dedicated experience, dashboard, and permissions.

---

## ✨ Features

### 🔐 Authentication
- Email & Password Login / Register
- Email Verification with 6-digit OTP
- Forgot Password → OTP Reset flow
- Google OAuth 2.0 Sign-in & Sign-up
- JWT Access Token + Refresh Token with silent auto-retry
- Remember Me functionality
- Role-based Route Guards (Admin / Instructor / Student)

### 🎓 Student
| Feature | Description |
|---------|-------------|
| Home | Browse all available courses |
| Course Details | Full course page with curriculum & reviews |
| Continue Learning | Video-based learning with progress tracking |
| Checkout | Cart → Order → Stripe Payment |
| Wishlist | Save courses for later |
| Profile | My Learnings, Certificates, Account settings |
| My Certificates | Download earned certificates |

### 👨‍🏫 Instructor
| Feature | Description |
|---------|-------------|
| Dashboard | Revenue, enrollments & rating charts |
| My Courses | Create, edit, and manage courses |
| Course Builder | Add curriculum, lessons, resources |
| Reviews | View and respond to student reviews |
| Payout | Earnings and payout history |
| Profile | Account & password management |

### 🛡️ Admin
| Feature | Description |
|---------|-------------|
| Dashboard | Platform-wide KPIs & charts |
| Users | View, ban/unban, change roles |
| Courses | Review and manage all courses |
| Categories | Create & manage course categories |
| Coupons | Create & manage discount coupons |
| Reviews | Moderate platform reviews |
| Payout | Manage instructor payouts |
| Contact Us | View submitted contact messages |
| Settings | Platform-wide configuration |
| Profile | Admin account management |

---

## 🏗️ Project Structure

```
src/
└── app/
    ├── core/
    │   ├── auth/                    # Auth components (login, register, verify, reset)
    │   ├── environment/             # API base URL config
    │   ├── guards/                  # auth / admin / instructor / student guards
    │   ├── interceptors/            # refresh-token & error interceptors
    │   ├── interfaces/              # TypeScript interfaces
    │   │   ├── Admin/               # admin-courses, Admin-Stats, Users, ...
    │   │   ├── Cart/
    │   │   ├── Categories/
    │   │   ├── COURSE/
    │   │   ├── CourseListItem/
    │   │   ├── CourseParams/
    │   │   ├── getCourseId/
    │   │   ├── my-enrollments/
    │   │   ├── MyCourseById/
    │   │   ├── mycourses/
    │   │   ├── ReviewResponse/
    │   │   ├── specificInstructor/
    │   │   └── WishList/
    │   ├── routes/                  # Lazy-loaded route configs
    │   │   ├── admin.routes.ts
    │   │   ├── auth.routes.ts
    │   │   ├── instructor.routes.ts
    │   │   └── student.routes.ts
    │   └── services/
    │       ├── Admin/
    │       ├── AdminReviews/
    │       ├── AUTHENTICATION/
    │       ├── AuthHelper/
    │       ├── categories/
    │       ├── certificates/
    │       ├── CheckoutState/
    │       ├── ContactUs/
    │       ├── Coupons/
    │       ├── COURSES/
    │       ├── Curriculm/
    │       ├── enrollments/
    │       ├── GoogleAuth/
    │       ├── homeService/
    │       ├── Instructor/
    │       ├── InstructorDashboard/
    │       ├── InstructorReviews/
    │       ├── Loader/
    │       ├── logout/
    │       ├── notifications/
    │       ├── Order/
    │       ├── Payment/
    │       ├── payoutAdmin/
    │       ├── payoutInstructor/
    │       ├── payouts/
    │       ├── Profile/
    │       ├── progress/
    │       ├── Resources/
    │       ├── REVIEWSS/
    │       ├── Search/
    │       ├── settings/
    │       ├── Theme/
    │       ├── Toast/
    │       └── WishList/
    │
    ├── features/
    │   ├── admins/
    │   │   ├── components/
    │   │   │   ├── navbar/
    │   │   │   └── sidebar/
    │   │   └── pages/
    │   │       ├── categories/
    │   │       ├── contact-us/
    │   │       ├── copons/
    │   │       ├── courses/
    │   │       ├── dashboard/
    │   │       ├── payout/
    │   │       ├── profile/
    │   │       ├── reviews/
    │   │       ├── settings/
    │   │       └── users/
    │   │
    │   ├── instructor/
    │   │   ├── components/
    │   │   │   ├── navbar-instructor/
    │   │   │   └── sidebar-instructor/
    │   │   └── pages/
    │   │       ├── dashboard/
    │   │       ├── my-courses/
    │   │       │   ├── create-course/
    │   │       │   ├── edit-course/
    │   │       │   └── spec-course/
    │   │       ├── payout/
    │   │       ├── profile/
    │   │       └── reviews/
    │   │
    │   └── Student/
    │       ├── about-us/
    │       ├── checkout/
    │       ├── home/
    │       │   └── components/courses/
    │       ├── navbar-student/
    │       ├── payment/
    │       │   └── components/
    │       │       ├── stripe-form/
    │       │       └── success-or-fail/
    │       ├── profile/
    │       │   └── components/sidebar/components/
    │       │       ├── my-certificates/
    │       │       ├── my-learnings/
    │       │       │   └── course-learning/
    │       │       └── my-profile/
    │       ├── specific-course-student/
    │       │   └── components/
    │       │       ├── continue-learning/
    │       │       │   └── components/
    │       │       │       ├── curriculum/
    │       │       │       ├── progress/
    │       │       │       └── reviews/
    │       │       └── curriculum/
    │       └── wishlist/
    │
    └── shared/layout/
        ├── course-cart/
        ├── server-error/
        └── toast/
```

---

## 🧰 Tech Stack

| Technology | Purpose |
|------------|---------|
| Angular 19 | Frontend framework |
| TypeScript 5 | Language |
| Tailwind CSS 3 | Styling |
| ApexCharts | Dashboard charts (area, column, donut) |
| Stripe.js | Payment processing |
| Google OAuth 2.0 | Social authentication |
| RxJS | Async data streams & operators |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Angular CLI >= 19

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/knovia.git
cd knovia

# Install dependencies
npm install

# Start dev server
ng serve
```

Open `http://localhost:4200`

### Environment Setup

Create `src/app/core/environment/environment.ts`:

```typescript
export const environment = {
  baseUrl: 'YOUR_API_BASE_URL/api/'
};
```

---

## 🔐 Authentication Flow

```
Register ──► Verify Email (OTP) ──► Login ──► Role-based Redirect
                                       │
                              Google OAuth (one step)

Forgot Password ──► Enter Email ──► OTP Code + New Password ──► Login
```

### JWT Token Strategy

```
Every Request
    └── Attach Bearer Token
              │
         401 Error?
              │
     ┌────────┴────────┐
  Refresh Token      No Token
     API call         Logout
        │
   ┌────┴────┐
 Success    Fail
   │          │
Retry Req   Logout
(queued)
```

> Concurrent requests during refresh are **queued** using `BehaviorSubject`, not dropped.

---

## 👥 Role System

```typescript
// Route is protected based on role from JWT
export const adminGuard: CanActivateFn = () => {
  // Admin only — redirects others to their correct home
};

export const instructorGuard: CanActivateFn = () => {
  // Instructor only
};

export const studentGuard: CanActivateFn = () => {
  // Student only
};

export const authGuard: CanActivateFn = () => {
  // Logged-in users can't access /auth/* pages
};
```

---

## 📊 Dashboards

### Admin Dashboard
- Total Users / Courses / Revenue / Enrollments KPI cards
- Revenue vs Enrollments combo chart (area + column)
- Adjustable period: 3 / 6 / 12 months
- Platform vs Instructor revenue split
- Skeleton loaders + Dark Mode

### Instructor Dashboard
- Total Courses / Students / Revenue / Rating KPIs
- Area chart — Revenue & Enrollments over time
- Donut chart — Published / Draft / Pending courses
- Animated progress bars per course status
- Top Courses table (sortable by enrollments, revenue, rating)
- Best month highlight + Average per month

---

## 💳 Payment Integration

```
Student selects courses
        │
    Checkout page
        │
   Create Order (API)
        │
  Receive clientSecret
        │
   Stripe Elements UI  ◄── adapts to dark/light theme
        │
  Confirm Payment
        │
   ┌────┴────┐
Success    Failure
   │          │
Result page  Result page
(success)   (error msg)
```

---

## 🌐 HTTP Interceptors

### `Refresh_Token` Interceptor
- Attaches `Authorization: Bearer <token>` to every request
- On 401: attempts silent token refresh
- Queues concurrent requests while refreshing
- Clears storage and redirects to `/auth/login` on refresh failure

### `errorInterceptor`
- Shows toast on every successful non-GET request
- Handles: `0` (offline), `401`, `403`, `404`, `4xx`, `5xx`
- Auto-redirects to `/server-error` on 5xx responses

---

## ⚡ Angular 19 Highlights

```typescript
// Signals for reactive state
loader        = signal<boolean>(false);
errMsg        = signal<string>('');
showPassword  = signal(false);
stats         = signal<AdminStats | null>(null);

// computed() for derived values
publishedPct = computed(() => {
  const s = this.summary();
  if (!s || s.totalCourses === 0) return 0;
  return Math.round((s.publishedCourses / s.totalCourses) * 100);
});

// New control flow — cleaner templates
@if (loader()) {
  <span class="animate-spin ..."></span>
} @else {
  Submit
}

@for (course of topCourses(); track course.courseId) {
  <tr>...</tr>
}
```

- ✅ 100% Standalone Components
- ✅ Lazy-loaded routes with `loadComponent`
- ✅ `forkJoin` + `takeUntil` for clean subscriptions
- ✅ `isPlatformBrowser` for SSR-safe DOM access
- ✅ `@ViewChild` / `@ViewChildren` for DOM references

---

## 🎨 UI / UX Details

- 🌙 Full **Dark Mode** across all screens
- 💀 **Skeleton loaders** before data loads
- 🏷️ Floating labels — pure Tailwind CSS, no library
- 🔢 OTP input with keyboard navigation & paste support
- 👁️ Password toggle (browser default eye icon hidden)
- ⏳ Loading spinner on every async action
- 🍞 Global toast notifications (success & error)
- 📱 Fully **Responsive** — mobile, tablet, desktop
- ✅ Reactive Forms with real-time validation messages
- 🔒 Stripe Elements adapt to dark/light theme

---

## 📸 Screenshots

> Add your screenshots here

| | | |
|---|---|---|
| ![Login]() Login | ![Register]() Register | ![Verify Email]() Verify Email |
| ![Admin Dashboard]() Admin Dashboard | ![Instructor Dashboard]() Instructor Dashboard | ![Payment]() Payment |
| ![Course Details]() Course Details | ![Continue Learning]() Continue Learning | ![Profile]() Profile |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ using Angular 19 &nbsp;|&nbsp; <b>Kno<span style="color:#F97316">via</span></b>
</div>
