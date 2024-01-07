import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { content } from './shared/routes/routes';

import { LayoutComponent } from './layout/layout.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/theme/paris',
    pathMatch: 'full',
  },
  {
    path: "maintenance",
    component: MaintenanceComponent
  },
  {
    path: "",
    component: LayoutComponent,
    children: content,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
