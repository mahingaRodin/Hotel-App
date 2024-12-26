import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DemoNgZorroAntdModule } from './DemoNgZorroAntdModule'; // Ensure correct import path
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { HttpClientModule } from '@angular/common/http';// Corrected import path
import { AppRoutingModule } from './app.routes'; // Ensure correct path
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { UserOutline, LoginOutline } from '@ant-design/icons-angular/icons'; // Import required icons

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NzIconModule,
  ],// Bootstrap AppComponent
})
export class AppModule {
  constructor(private iconService: NzIconService) {
    // Register required icons
    this.iconService.addIcon(UserOutline, LoginOutline);
  }
}
