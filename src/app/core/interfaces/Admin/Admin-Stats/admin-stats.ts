export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  newUsersThisMonth: number;
  totalCourses: number;
  publishedCourses: number;
  pendingCourses: number;
  totalRevenue: number;
  totalGMV: number;
  platformRevenue: number;
  instructorRevenue: number; 
  revenueThisMonth: number;
  revenueGrowthPercent: number;
  totalEnrollments: number;
  enrollmentsThisMonth: number;
  totalReviews: number;
  averageRating: number;
  monthlyRevenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  label: string;
  amount: number;
  count: number;
}
