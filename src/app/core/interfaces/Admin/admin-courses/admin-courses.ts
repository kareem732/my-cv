
export type AdminCoursesRes = AdminCourses[]

export interface AdminCourses {
  id: number
  title: string
  instructorName: string
  status: string
  price: number
  discountPrice: number | null
  enrollments: number
  averageRating: number
  totalRatings: number
  rejectionReason: any
  createdAt: string
}
