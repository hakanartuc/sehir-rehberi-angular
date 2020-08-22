import { Injectable } from '@angular/core';
import { LoginUser } from '../models/loginUser';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { JwtHelperService  } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { AlertifyService } from './alertify.service';
import { RegisterUser } from '../models/registerUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  path = 'https://localhost:44340/api/auth/';
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = 'token';

  login(loginUser: LoginUser) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    this.httpClient
      .post(this.path + 'login', loginUser, { headers: headers })      
      .subscribe((data) => {      

        this.saveToken(data.toString());
        this.userToken = data;
        this.decodedToken = this.jwtHelper.decodeToken(data.toString());
        this.alertifyService.success('Sisteme giriş yapıldı.');
        this.router.navigateByUrl('/city');
      });
  }

  register(registerUser: RegisterUser): void {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    this.httpClient
      .post(this.path + 'register', registerUser, {
        headers: headers,
      })
      .subscribe((data) => {});
  }

  logOut(): void {
    this.alertifyService.warning('Sistemden çıkış yapıldı.');
    localStorage.removeItem(this.TOKEN_KEY);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  loggedIn(){
   
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  get token(): any {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId(): number {
    return this.jwtHelper.decodeToken(this.token).nameid;
  }
}
