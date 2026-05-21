export interface CourseListItem {
  id: number;
  title: string;
  shortDescription: string;
  thumbnailUrl: string;
  price: number;
  discountPrice: number;
  level: string;
  language: string;
  instructorName: string;
  subCategoryName: string;
  status: 'Published' | 'Draft' | 'Pending' | 'Archived' | 'Underreview';
  averageRating: number;
  totalStudents: number;
  createdAt: string;
}
