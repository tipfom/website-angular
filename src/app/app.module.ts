import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/home/landing-page/landing-page.component';
import { HomeNavigationBarComponent } from './pages/home/home-navigation-bar/home-navigation-bar.component';
import { ContentContactComponent } from './pages/home/content-contact/content-contact.component';
import { FooterComponent } from './footer/footer.component';
import { ContentAboutmeComponent } from './pages/home/content-aboutme/content-aboutme.component';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { HomeComponent } from './pages/home/home.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CmsComponent } from './pages/admin/cms/cms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
    ResourceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
