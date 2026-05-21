export interface Cart {
  success: boolean
  data: Data
  message: string
  errors: any
  timestamp: string
}

export interface Data {
  cartId: number
  items: Item[]
  subtotal: number
  tax: number
  discount: number
  total: number
  itemCount: number
  isEmpty: boolean
}

export interface Item {
  cartItemId: number
  addedAt: string
  courseId: number
  title: string
  thumbnailUrl: string
  category: string
  difficulty: string
  price: number
  instructorName: string
  instructorSlug: string
  totalDuration: number
  totalLessons: number
  averageRating: number
}
