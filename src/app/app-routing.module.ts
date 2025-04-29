import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./modules/dashboard/pages/layout/layout.component";
import {RoleGuard} from "./guards/auth.guard";


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth-routing/auth.module').then(m => m.AuthModule)
  },
  {
    path:'home',
    component: LayoutComponent,
    canActivate: [RoleGuard],
    data: { rol: ['estudiante','admin','profesor'] },
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: 'auth',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
