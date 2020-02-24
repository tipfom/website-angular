import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { ContentContactComponent } from './content-contact/content-contact.component';
import { FooterComponent } from './footer/footer.component';
import { ContentAboutmeComponent } from './content-aboutme/content-aboutme.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    NavigationBarComponent,
    ContentContactComponent,
    FooterComponent,
    ContentAboutmeComponent,
    ContentAboutmeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
