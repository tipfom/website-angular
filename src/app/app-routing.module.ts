import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminGuardService } from './services/admin-guard.service';
import { ResourceComponent } from './pages/resource/resource.component';
import { ArticleComponent } from './pages/article/article.component';
import { ArticlesComponent } from './pages/articles/articles.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'aboutme',
    component: AboutmeComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'res/:id',
    component: ResourceComponent
  },
  {
    path: 'article/:name',
    component: ArticleComponent
  },
  {
    path: 'article/:name/:version',
    component: ArticleComponent
  },
  {
    path: 'articles',
    component: ArticlesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64],
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
