import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { error } from 'console';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          if (response.userId != null) {
            const user = {
              id: response.userId,
              role: response.userRole,
            };
            UserStorageService.saveUser(user);
            UserStorageService.saveToken(response.jwt);

            if (UserStorageService.isAdminLoggedIn()) {
              this.router.navigateByUrl('/admin/dashboard');
            } else if (UserStorageService.isCustomerLoggedIn()) {
              this.router.navigateByUrl('/customer/rooms');
            }
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.message.error(`Bad credentials`, { nzDuration: 5000 });
        },
      });
    }
  }
}
