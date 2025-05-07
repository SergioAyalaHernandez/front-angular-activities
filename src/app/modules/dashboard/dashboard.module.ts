import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AsideComponent } from './pages/aside/aside.component';
import { LayoutComponent } from './pages/layout/layout.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CreateActivityComponent } from './pages/create-activity/create-activity.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { CreateUsersComponent } from './pages/create-users/create-users.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { UserComponent } from './pages/user/user.component';
import { ListActivitiesComponent } from './pages/list-activities/list-activities.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { ActivityDetailComponent } from './pages/activity-detail/activity-detail.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { StudentListActivitiesComponent } from './pages/student-list-activities/student-list-activities.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AsideComponent,
    LayoutComponent,
    CreateActivityComponent,
    SidebarComponent,
    NavbarComponent,
    CreateUsersComponent,
    ListUsersComponent,
    UserComponent,
    ListActivitiesComponent,
    UserDetailsComponent,
    ActivityDetailComponent,
    ChatbotComponent,
    StudentListActivitiesComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DashboardModule { }
