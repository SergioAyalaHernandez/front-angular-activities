import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {CreateActivityComponent} from "./pages/create-activity/create-activity.component";
import {RoleGuard} from "../../guards/auth.guard";
import {CreateUsersComponent} from "./pages/create-users/create-users.component";
import {ListUsersComponent} from "./pages/list-users/list-users.component";
import {UserComponent} from "./pages/user/user.component";
import {ListActivitiesComponent} from "./pages/list-activities/list-activities.component";
import {UserDetailsComponent} from "./pages/user-details/user-details.component";
import {ActivityDetailComponent} from "./pages/activity-detail/activity-detail.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'create-activity',
    component: CreateActivityComponent,
    canActivate: [RoleGuard],
    data: { rol: ['admin'] },
  },
  {
    path: 'create-user',
    component: CreateUsersComponent,
    canActivate: [RoleGuard],
    data: { rol: ['admin','profesor'] },
  },
  { path: 'users',
    component: ListUsersComponent,
    canActivate: [RoleGuard],
    data: { rol: ['admin'] },
  },
  { path: 'users/:id',
    component: UserComponent,
    canActivate: [RoleGuard],
    data: { rol: ['admin'] },
  },
  { path: 'list-activity',
    component: ListActivitiesComponent,
  },
  { path: 'user-detail',
    component: UserDetailsComponent,
  },
  { path: 'actividades/:id',
    component: ActivityDetailComponent },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
