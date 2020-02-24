import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SiteAboutmeComponent } from './site-aboutme/site-aboutme.component';
import { SiteHomeComponent } from './site-home/site-home.component';


const routes: Routes = [
  {
    path: '',
    component: SiteHomeComponent
  },
  {
    path: 'aboutme',
    component: SiteAboutmeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
