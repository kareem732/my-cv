export type MyCourses = course[]

export interface course {
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
  isPublished: boolean;
}
