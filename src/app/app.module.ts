import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OnPushComponent } from './on-push/on-push.component';
import { PageComponent } from './page/page.component';
import { preLoad } from './preload';
import { environment } from '../environments/environment';
import { TranslocoModule, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, TranslocoConfig } from '@ngneat/transloco';

@NgModule({
  declarations: [AppComponent, HomeComponent, PageComponent, OnPushComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, TranslocoModule],
  providers: [
    preLoad,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        runtime: false,
        defaultLang: 'en',
        prodMode: environment.production
      } as TranslocoConfig
    },
    { provide: TRANSLOCO_LOADER, useFactory: HttpLoader }
    // webpackLoader
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function HttpLoader(http: HttpClient) {
  return function(lang: string) {
    return http.get(`../assets/i18n/${lang}.json`);
  };
}
