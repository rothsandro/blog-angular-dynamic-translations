import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { DynamicTranslationSlotDirective } from './dynamic-translation-slot.directive';
import { DynamicTranslationComponent } from './dynamic-translation.component';
import { ExampleComponent } from './example/example.component';

@NgModule({
  declarations: [AppComponent, DynamicTranslationSlotDirective, DynamicTranslationComponent, ExampleComponent],
  imports: [BrowserModule, HttpClientModule, TranslocoRootModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
