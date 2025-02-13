import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DemoNgZorroAntdModule } from './DemoNgZorroAntdModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { UserOutline, LoginOutline } from '@ant-design/icons-angular/icons';
import { AuthService } from './auth/services/auth/auth.service';

// Define the routes
const routes: Routes = [
  // Your existing routes will go here
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    HttpClientModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    NzIconModule,
    
  ],
  declarations: [AppComponent],  
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideHttpClient(withFetch()),
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(UserOutline, LoginOutline);
  }
}
