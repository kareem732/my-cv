import {
  Component, inject, OnInit, OnDestroy,
  signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  debounceTime, distinctUntilChanged,
  Subject, switchMap, takeUntil
} from 'rxjs';
import { AdminService } from '../../../../core/services/Admin/admin.service';
import { User } from '../../../../core/interfaces/Admin/Users/users';
import { GetUserId } from '../../../../core/interfaces/Admin/GetUserId/get-user-id';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {
  private adminService = inject(AdminService);
  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

  readonly skeletonRows = Array(8);

  users        = signal<User[]>([]);
  isLoading    = signal(false);
  searchQuery  = signal('');
  filterBanned = signal<boolean | undefined>(undefined);

  totalUsers  = computed(() => this.users().length);
  bannedUsers = computed(() => this.users().filter(u => u.isBanned).length);

  openDropdownId      = signal<string | null>(null);
  currentDropdownUser = signal<User | null>(null);
  dropdownTop         = signal(0);
  dropdownLeft        = signal(0);

  selectedUser      = signal<GetUserId | null>(null);
  isLoadingDetail   = signal(false);
  isDetailModalOpen = signal(false);

  isBanModalOpen  = signal(false);
  banTargetUser   = signal<User | null>(null);
  banReason       = signal('');
  isBanLoading    = signal(false);

  isRoleModalOpen  = signal(false);
  roleTargetUser   = signal<User | null>(null);
  selectedRole     = signal('');
  isRoleLoading    = signal(false);

  toastMessage = signal('');
  toastType    = signal<'success' | 'error'>('success');
  toastVisible = signal(false);

  private searchSubject = new Subject<string>();
  private destroy$      = new Subject<void>();

  ngOnInit(): void {
    this.loadUsers();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getThumbnailUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(search => {
        this.isLoading.set(true);
        return this.adminService.getUsers(search, this.filterBanned());
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => { this.users.set(data); this.isLoading.set(false); },
      error: ()   => this.isLoading.set(false)
    });
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.adminService
      .getUsers(this.searchQuery(), this.filterBanned())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => { this.users.set(data); this.isLoading.set(false); },
        error: ()   => this.isLoading.set(false)
      });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const map: Record<string, boolean | undefined> = { banned: true, active: false };
    this.filterBanned.set(map[value]);
    this.loadUsers();
  }

  toggleDropdown(user: User, event: MouseEvent): void {
    event.stopPropagation();
    const dropdownWidth = 176;

    if (this.openDropdownId() === user.id) {
      this.closeDropdown();
      return;
    }

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 120;

    const top  = spaceBelow < dropdownHeight
      ? rect.top - dropdownHeight
      : rect.bottom + 4;

    const left = rect.right - dropdownWidth;

    this.dropdownTop.set(top);
    this.dropdownLeft.set(left);
    this.openDropdownId.set(user.id);
    this.currentDropdownUser.set(user);
  }

  closeDropdown(): void {
    this.openDropdownId.set(null);
    this.currentDropdownUser.set(null);
  }

  viewUser(userId: string): void {
    this.closeDropdown();
    this.isDetailModalOpen.set(true);
    this.isLoadingDetail.set(true);
    this.adminService.getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => { this.selectedUser.set(data); this.isLoadingDetail.set(false); },
        error: ()   => {
          this.isLoadingDetail.set(false);
        }
      });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen.set(false);
    this.selectedUser.set(null);
  }

  openBanModal(user: User): void {
    this.closeDropdown();
    this.banTargetUser.set(user);
    this.banReason.set('');
    this.isBanModalOpen.set(true);
  }

  closeBanModal(): void {
    this.isBanModalOpen.set(false);
    this.banTargetUser.set(null);
  }

  confirmBan(): void {
    const user = this.banTargetUser();
    if (!user || !this.banReason().trim()) return;

    this.isBanLoading.set(true);
    this.adminService.banUser(user.id, this.banReason())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.users.update(list =>
            list.map(u => u.id === user.id ? { ...u, isBanned: true } : u)
          );
          this.isBanLoading.set(false);
          this.closeBanModal();
        },
        error: () => {
          this.isBanLoading.set(false);
        }
      });
  }

  unbanUser(user: User): void {
    this.closeDropdown();
    this.adminService.unbanUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.users.update(list =>
            list.map(u => u.id === user.id ? { ...u, isBanned: false } : u)
          );
        },
      });
  }

  openRoleModal(user: User): void {
    this.closeDropdown();
    this.roleTargetUser.set(user);
    this.selectedRole.set(user.roles[0] ?? 'Student');
    this.isRoleModalOpen.set(true);
  }

  closeRoleModal(): void {
    this.isRoleModalOpen.set(false);
    this.roleTargetUser.set(null);
  }

  confirmRoleChange(): void {
    const user = this.roleTargetUser();
    if (!user) return;

    this.isRoleLoading.set(true);
    this.adminService.changeUserRole(user.id, this.selectedRole())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.users.update(list =>
            list.map(u => u.id === user.id ? { ...u, roles: [this.selectedRole()] } : u)
          );
          this.isRoleLoading.set(false);
          this.closeRoleModal();
        },
        error: () => {
          this.isRoleLoading.set(false);
        }
      });
  }



  getRoleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      Admin:      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Instructor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Student:    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
    return map[role] ?? 'bg-gray-100 text-gray-800';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB');
  }

  getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }
}
