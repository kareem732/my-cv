export interface GetUserId {
  id: string;
  fullName: string;
  email: string;
  userName: string;
  profilePicture: string | null;
  isEmailConfirmed: boolean;
  isBanned: boolean;
  createdAt: string;
  roles: string[];
  enrollmentsCount: number;
  coursesCount: number;
}
