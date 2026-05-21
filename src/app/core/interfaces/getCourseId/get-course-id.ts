export interface data {
  courseId: number
  title: string
  description: string
  instructorId: string
  instructorName: string
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
  slug:string
  totalDuration: number
  totalLessons: number
  totalEnrollments: number
  averageRating: number
  totalReviews: number
  updatedAt: string
  enrollmentStatus: EnrollmentStatus
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

export interface EnrollmentStatus {
  isEnrolled: boolean
  isCompleted: boolean
  progressPercentage: number
  buttonText: string
  buttonAction: string
}
