import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  register(data: {
    email: string;
    nombre: string;
    identificacion: string;
    password: string;
    rol: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  login(data: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

  logout(): void {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('rol');
    this.cookieService.delete('id');
    this.router.navigate(['/login']);

  }

  isAuthenticated(): boolean {
    return this.cookieService.check('accessToken');
  }

  getUserRole(): string {
    return this.cookieService.get('rol') || '';
  }

  getUserId(): string {
    return this.cookieService.get('id') || '';
  }

  getMail(): string {
    return <string>sessionStorage.getItem('userEmail');
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return roles.includes(userRole);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.cookieService.get('refreshToken');
    return this.http.post(`${this.apiUrl}/refresh/`, { refresh: refreshToken });
  }

  getUsers(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/?page=${page}&per_page=${perPage}`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/detail/${id}`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}/`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}/`);
  }

}
