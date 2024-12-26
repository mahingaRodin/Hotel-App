import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { UserOutline, LoginOutline } from '@ant-design/icons-angular/icons'; // Import icons
import { UserStorageService } from './auth/services/storage/user-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isCollapsed = false;
  title = 'HotelWeb';
  isCustomerLoggedIn = false;
  isAdminLoggedIn = false;

  constructor(private iconService: NzIconService, private router: Router) {
    // Initialize icons
    this.iconService.addIcon(UserOutline, LoginOutline);

    // Initialize login states
    this.initializeLoginStates();
  }

  private initializeLoginStates(): void {
    try {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
    } catch (error) {
      console.error('Error initializing login states:', error);
    }
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
        this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
      }
    })
  }

  logout() {
    UserStorageService.signOut();
    this.router.navigateByUrl('/');
  }
}
