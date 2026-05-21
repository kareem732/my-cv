export interface MyCourseById {
  success: boolean
  data: Data
  message: string
  errors: any
  timestamp: string
}

export interface Data {
  courseId: number
  title: string
  description: string
  isPublished: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
  instructorId: string
  instructorName: string
  slug: string
  instructorBio: string
  instructorAvatarUrl: string
  category: string
  difficulty: string
  language: string
  price: number
  thumbnailUrl: string
  learningObjectives: string
  prerequisites: string
  requirements: string
  sections: Section[]
  totalDuration: number
  totalDurationDisplay: string
  totalLessons: number
  totalEnrollments: number
  averageRating: number
  totalReviews: number
  totalRevenue: number
  emptySectionsCount: number
  lessonsWithoutVideoCount: number
  isReadyToPublish: boolean
  publishBlockers: any[]
  contentCompletionPercentage: number
  lastEnrollmentDate: any
  averageWatchTimeHours: any
}

export interface Section {
  sectionId: number
  title: string
  orderIndex: number
  lessons: Lesson[]
}

export interface Lesson {
  lessonId: number
  title: string
  videoUrl: string
  durationSeconds: number
  orderIndex: number
  isFreePreview: boolean
}
