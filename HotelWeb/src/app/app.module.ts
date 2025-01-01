import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DemoNgZorroAntdModule } from './DemoNgZorroAntdModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { UserOutline, LoginOutline } from '@ant-design/icons-angular/icons';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NzIconModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class AppModule {
  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(UserOutline, LoginOutline);
  }
}
