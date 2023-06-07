import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  onLogin(): void {
    this.authService
      .login('dianipineda55@gmail.com', '123456')
      .subscribe((user) => {
        this.router.navigate(['/']);
      });
  }
}
