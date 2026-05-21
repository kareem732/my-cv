export interface ReviewResponse {
  success: boolean
  data: ReviewData
  message: string
  errors: any
  timestamp: string
}

export interface ReviewData {
  reviewId: number
  courseId: number
  courseName: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  instructorReply: string
  instructorRepliedAt: string
  hasInstructorReply: boolean
  createdAt: string
  updatedAt: string
  isEdited: boolean
}
