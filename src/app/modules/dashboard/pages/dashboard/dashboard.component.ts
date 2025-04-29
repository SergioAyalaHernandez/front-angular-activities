import {Component, OnInit} from '@angular/core';
import {Actividad, ActivityService} from "../../../../services/activity.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  actividades: Actividad[] = [];
  loading = true;
  maxActividades = 12;

  constructor(private actividadesService: ActivityService) {
  }

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit(): void {
    this.actividadesService.obtenerActividades().subscribe((data) => {
      this.actividades = data;
      this.loading = false;
    });
  }
  isLargePosition(index: number): boolean {
    return [0, 8].includes(index);
  }

  get gridPositions(): number[] {
    return Array(this.maxActividades).fill(0).map((_, i) => i);
  }
}
