import { Component } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  isAdmin: boolean = false;
  menuItems: MenuItem[] = [
    { icon: 'home', label: 'Inicio', route: '/home' },
    {
      icon: 'user',
      label: 'Usuarios',
      children: [
        { icon: 'profile', label: 'Crear Usuario', route: 'create-user', adminOnly: true },
        { icon: 'profile', label: 'Listado de usuarios', route: 'users', adminOnly: true },
        { icon: 'profile', label: 'mi perfil', route: 'user-detail' },
      ]
    },
    {
      icon: 'user',
      label: 'Actividades',
      children: [
        { icon: 'admin', label: 'Crear Actividad', route: '/home/create-activity' ,adminOnly: true},
        { icon: 'admin', label: 'Listar Actividades', route: '/home/list-activity' },
      ]
    }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    const userRoles = this.authService.getUserRole();
    this.isAdmin = userRoles.includes('admin');
  }

  // Alternar el menú de hamburguesa
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }
  filterMenuItems(items: MenuItem[]): MenuItem[] {
    return items;
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
