import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { Router } from "@angular/router";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { error } from "console";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NzFormModule, NzInputModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router, 

  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    })
  }

  submitForm() {
    this.authService.login(this.loginForm.value).subscribe(res => {
      console.log(res);
    }, error => {
      this.message
        .error(
          `Bad credentials`, 
          {nzDuration: 5000 }
      )
    } )
  }

}
