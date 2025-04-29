import { Component } from '@angular/core';
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  notifications$ = this.notificationService.notifications$;

  constructor(private notificationService: NotificationService) {}

  removeNotification(id: number) {
    this.notificationService.removeNotification(id);
  }
}
