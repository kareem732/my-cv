import { CourseListItem } from "../CourseListItem/course-list-item";

export interface COURSERES {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  data: CourseListItem[];
}
