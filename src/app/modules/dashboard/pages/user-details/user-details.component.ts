import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {NotificationService} from "../../../../services/notification.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any = null;


  constructor(private userService: AuthService,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    const userId = this.userService.getUserId();

    if (userId) {
      this.userService.getUserById(userId).subscribe(res => {
        this.user = res.user;
        this.notificationService.showNotification('Datos entregados con exito','success');
      });
    }
  }
}
