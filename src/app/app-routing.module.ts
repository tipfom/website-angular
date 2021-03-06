import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { HomeComponent } from './pages/home/home.component';
import { ArticleComponent } from './pages/article/article.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { Error404Component } from './pages/error404/error404.component';
import { CoronaComponent } from './pages/corona/corona.component';
import { RangeSliderComponent } from './pages/corona/range-slider/range-slider.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'aboutme',
    component: AboutmeComponent
  },
  {
    path: 'article/:name',
    component: ArticleComponent
  },
  {
    path: 'articles',
    component: ArticlesComponent
  },
  {
    path: '404',
    component: Error404Component
  },
  {
    path: 'corona',
    component: CoronaComponent,
    pathMatch: 'prefix'
  },
  {
    path: '**',
    redirectTo: '404'
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
