import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private idCounter = 0;

  showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number = 3000) {
    const id = ++this.idCounter;
    const notification: Notification = { id, message, type };
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remover después de `duration` ms
    setTimeout(() => this.removeNotification(id), duration);
  }

  removeNotification(id: number) {
    const updatedNotifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }
}
