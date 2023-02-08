import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUser } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userFormGroup!: FormGroup;
  errorMessage: any;
  constructor(private fb: FormBuilder, private auth: AuthentificationService, private router: Router) { }

  ngOnInit(): void {
    this.userFormGroup = this.fb.group({
      username: this.fb.control(""),
      password: this.fb.control("")
    });

  }
  handleLogin() {
    let username = this.userFormGroup.value.username;
    let password = this.userFormGroup.value.password;
    this.auth.login(username, password).subscribe({
      next: (appUser: AppUser) => {
        this.auth.authenticateUser(appUser).subscribe({
          next: (data: boolean) => {
            this.router.navigateByUrl("/products");

          },
          error: (err) => { this.errorMessage = err; }
        });

      },
      error: (err) => {this.errorMessage = err;

      }
    });
  }

}
