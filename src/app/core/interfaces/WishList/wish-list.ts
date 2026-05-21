export interface WishList {
  success: boolean
  data: Data
  message: string
  errors: any
  timestamp: string
}

export interface Data {
  totalItems: number
  totalValue: number
  items: Item[]
}

export interface Item {
  wishlistId: number
  addedAt: string
  courseId: number
  title: string
  description: string
  thumbnailUrl: string
  category: string
  difficulty: string
  price: number
  instructorName: string
  instructorSlug: string
  totalDuration: number
  totalLessons: number
  averageRating: number
  totalEnrollments: number
}
