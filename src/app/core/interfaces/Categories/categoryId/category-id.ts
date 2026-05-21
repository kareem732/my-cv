export interface CategoryId {
  id: number
  name: string
  slug: string
  description: string
  iconUrl: string
  order: number
  totalCourses: number
  subCategories: SubCategory[]
}

export interface SubCategory {
  id: number
  name: string
  slug: string
  description: string
  order: number
  courseCount: number
}
