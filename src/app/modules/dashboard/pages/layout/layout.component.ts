import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  // Bandera para determinar si es móvil o escritorio
  isMobile: boolean = false;
  isCollapsed: boolean = false;

  // Detectar el tamaño de la pantalla
  constructor() {}

  ngOnInit(): void {
    this.checkIfMobile();
  }

  // Método para verificar si la pantalla es móvil
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  // Comprobación si el ancho de la pantalla es menor que el tamaño de un dispositivo móvil (ej. 768px)
  private checkIfMobile() {
    this.isMobile = window.innerWidth <= 768; // Puedes ajustar el tamaño según tu diseño
  }

  // Método para alternar el estado del sidebar
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
