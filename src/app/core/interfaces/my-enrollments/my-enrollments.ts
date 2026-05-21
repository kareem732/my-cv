export interface MyEnrollments {
  success: boolean
  data: Daum[]
  message: string
  errors: any
  timestamp: string
}

export interface Daum {
  enrollmentId: number
  courseId: number
  courseTitle: string
  courseThumbnailUrl: string
  instructorName: string
  category: string
  progressPercentage: number
  isCompleted: boolean
  enrolledAt: string
  lastAccessedAt: string
  nextLessonId: number
  nextLessonTitle: string
}
