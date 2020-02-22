import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LocationComponentComponent } from './location-component/location-component.component';
import { ContentWeatherComponent } from './content-weather/content-weather.component';
import { ContentSocialMediaComponent } from './content-social-media/content-social-media.component';
import { ContentContactComponent } from './content-contact/content-contact.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    NavigationBarComponent,
    LocationComponentComponent,
    ContentWeatherComponent,
    ContentSocialMediaComponent,
    ContentContactComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
