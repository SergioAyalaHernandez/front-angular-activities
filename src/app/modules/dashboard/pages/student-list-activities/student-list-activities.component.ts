import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {NotificationService} from '../../../../services/notification.service';
import {ActivityService} from "../../../../services/activity.service";

@Component({
  selector: 'app-student-list-activities',
  templateUrl: './student-list-activities.component.html',
  styleUrls: ['./student-list-activities.component.css']
})
export class StudentListActivitiesComponent implements OnInit {
  studentActivities: any[] = [];
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private activityService: ActivityService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadStudentActivities();
  }

  loadStudentActivities(): void {
    this.loading = true;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.notificationService.showNotification('No se encontró información de usuario', 'error');
      this.loading = false;
      return;
    }

    this.activityService.getActividadesUsuario(userId).subscribe({
      next: (response) => {
        this.studentActivities = response;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showNotification('Error al cargar tus actividades', 'error');
        this.loading = false;
      }
    });
  }
}
