export interface SpecificInstructor {
  success: boolean
  data: Data
  message: string
  errors: any
  timestamp: string
}

export interface Data {
  username: string
  fullName: string
  bio: string
  avatarUrl: string
  totalCourses: number
  totalStudents: number
  averageRating: number
  totalReviews: number
  courses: Course[]
}

export interface Course {
  courseId: number
  title: string
  instructorName: string
  averageRating: number
  difficulty: string
  price: number
  thumbnailUrl: string
  totalEnrollments: number
  updatedAt: string
  category: string
  language: string
}
