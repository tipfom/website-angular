import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, SecurityContext } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
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
import { LanguagePopupComponent } from './popups/language-popup/language-popup.component';
import { Error404Component } from './pages/error404/error404.component';
import { CoronaComponent } from './pages/corona/corona.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { RangeSliderComponent } from './pages/corona/range-slider/range-slider.component';
import { LocaleintPipe } from './pipes/localeint.pipe';
import { LocaledeltaPipe } from './pipes/localedelta.pipe';
import { SliderdatePipe } from './pipes/sliderdate.pipe';

PlotlyModule.plotlyjs = PlotlyJS;

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
    ArticlesComponent,
    LanguagePopupComponent,
    Error404Component,
    CoronaComponent,
    RangeSliderComponent,
    LocaleintPipe,
    LocaledeltaPipe,
    SliderdatePipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: MarkedOptionsFactory,
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    PlotlyModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export function MarkedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  renderer.image = (href, title, text) => {
    return `<p class="centerp"><img src="${href}" alt="${text}">${text}</p>`
  };
  return { renderer: renderer };
}
