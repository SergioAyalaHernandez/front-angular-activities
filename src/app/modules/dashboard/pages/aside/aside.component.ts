import { Component, Input, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";

interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
  @Input() collapsed = false;
  @Output() collapseChange = new EventEmitter<boolean>();
  isAdmin: boolean = false;
  sidebarVisible = false;
  isMobile = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkUserRole();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768; // Detectar si es móvil
  }

  checkUserRole() {
    const userRoles = this.authService.getUserRole();
    this.isAdmin = userRoles.includes('admin') || userRoles.includes('profesor');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  menuItems: MenuItem[] = [
    { icon: 'home', label: 'Inicio', route: '/home' },
    {
      icon: 'user',
      label: 'Usuarios',
      children: [
        { icon: 'profile', label: 'Crear Usuario', route: 'create-user', adminOnly: true },
        { icon: 'profile', label: 'Listado de usuarios', route: 'users', adminOnly: true },
        { icon: 'profile', label: 'mi perfil', route: 'user-detail'},
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

  toggleSubmenu(item: MenuItem) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  filterMenuItems(items: MenuItem[]): MenuItem[] {
    return items
      .filter(item => !item.adminOnly || (item.adminOnly && this.isAdmin))
      .map(item => ({
        ...item,
        children: item.children ? this.filterMenuItems(item.children) : undefined
      }));
  }
}
