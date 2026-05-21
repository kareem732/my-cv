import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment2 } from '../../environment/ENV';


export interface DashboardSummary {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  pendingCourses: number;
  totalStudents: number;
  newStudentsThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowthPercent: number;
  averageRating: number;
  totalReviews: number;
}

export interface MonthlyDataPoint {
  year: number;
  month: number;
  label: string;
  amount: number;
  count: number;
}

export interface RevenueData {
  monthlyRevenue: MonthlyDataPoint[];
  totalRevenue: number;
  averagePerMonth: number;
  bestMonthRevenue: number;
  bestMonth: string;
}

export interface EnrollmentData {
  monthlyEnrollments: MonthlyDataPoint[];
  totalEnrollments: number;
  thisMonthCount: number;
  lastMonthCount: number;
  growthPercent: number;
}

export interface TopCourse {
  courseId: number;
  title: string;
  thumbnailUrl: string;
  status: string;
  enrollments: number;
  revenue: number;
  rating: number;
  reviews: number;
}

export type RevenueMonths = 3 | 6 | 12;
export type EnrollmentMonths = 3 | 6 | 12;
export type TopCourseSortBy = 'enrollments' | 'revenue' | 'rating';


@Injectable({
  providedIn: 'root'
})
export class InstructorDashboardService {

  private readonly baseUrl = environment2.baseUrl;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${this.baseUrl}instructor/dashboard/summary`
    );
  }


  getRevenue(months: RevenueMonths = 12): Observable<RevenueData> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<RevenueData>(
      `${this.baseUrl}instructor/dashboard/revenue`,
      { params }
    );
  }


  getEnrollments(months: EnrollmentMonths = 12): Observable<EnrollmentData> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<EnrollmentData>(
      `${this.baseUrl}instructor/dashboard/enrollments`,
      { params }
    );
  }

  getTopCourses(
    top: number = 5,
    sortBy: TopCourseSortBy = 'enrollments'
  ): Observable<TopCourse[]> {
    const params = new HttpParams()
      .set('top', top.toString())
      .set('sortBy', sortBy);
    return this.http.get<TopCourse[]>(
      `${this.baseUrl}instructor/dashboard/top-courses`,
      { params }
    );
  }
}
