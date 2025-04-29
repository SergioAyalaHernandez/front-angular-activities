import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit{
  users: any[] = [];
  currentPage = 1;
  totalUsers = 0;
  pages = 0;
  perPage = 5;
  loading = false;
  error: string = '';

  constructor(private userService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUsers(this.currentPage, this.perPage).subscribe(
      res => {
        this.users = res.users;
        this.totalUsers = res.total;
        this.pages = res.pages;
        this.loading = false;
      },
      err => {
        this.error = 'Error al cargar los usuarios. Intente nuevamente.';
        this.loading = false;
      }
    );
  }

  getPaginationRange(): number[] {
    const maxPagesToShow = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(this.pages, start + maxPagesToShow - 1);

    // Ajustar el inicio si estamos cerca del final
    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    return Array(end - start + 1).fill(0).map((_, i) => start + i);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  viewDetails(userId: string): void {
    this.router.navigate(['/home/users', userId]);
  }

}
