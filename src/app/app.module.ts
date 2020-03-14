import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, SecurityContext } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MarkdownModule } from 'ngx-markdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CmsComponent } from './pages/admin/cms/cms.component';
import { ArticleComponent } from './pages/article/article.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ContentAboutmeComponent } from './pages/home/content-aboutme/content-aboutme.component';
import { ContentContactComponent } from './pages/home/content-contact/content-contact.component';
import { ContentSpotlightComponent } from './pages/home/content-spotlight/content-spotlight.component';
import { HomeNavigationBarComponent } from './pages/home/home-navigation-bar/home-navigation-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingPageComponent } from './pages/home/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { ResourceComponent } from './pages/resource/resource.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HomeNavigationBarComponent,
    ContentContactComponent,
    FooterComponent,
    ContentAboutmeComponent,
    AboutmeComponent,
    HomeComponent,
    NavigationBarComponent,
    AdminComponent,
    CmsComponent,
    LoginComponent,
    ResourceComponent,
    ArticleComponent,
    ContentSpotlightComponent,
    ArticlesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
