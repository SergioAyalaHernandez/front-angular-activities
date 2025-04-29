import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {NotificationService} from "../../../../services/notification.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any = null;
  showEditModal = false;
  showDeleteModal = false;
  editUser: any = {};

  constructor(private route: ActivatedRoute,
              private userService: AuthService,
              private router: Router,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe(res => {
        this.user = res.user;
      });
    }
  }


  onUpdateUser() {
    // Llenar el formulario del modal con los datos actuales
    this.editUser = { ...this.user };
    this.showEditModal = true;
  }

  cancelEdit() {
    this.showEditModal = false;
  }

  saveEdit() {
    if (this.user && this.user._id) {
      this.userService.updateUser(this.user._id, this.editUser).subscribe(res => {
        this.user = { ...this.editUser };
        this.showEditModal = false;
        this.notificationService.showNotification('Usuario actualizado correctamente', 'success');
      });
    }
  }


  onDeleteUser() {
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.user && this.user._id) {
      this.userService.deleteUser(this.user._id).subscribe(res => {
        this.notificationService.showNotification('Usuario eliminado correctamente', 'success');
        this.router.navigate(['/usuarios']);
        this.showDeleteModal = false;
      });
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }
}
