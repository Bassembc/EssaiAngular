import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { AppUser } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  users!: AppUser[];
  authenticatedUser!: AppUser;
  constructor() {
    this.users.push({ userId: UUID.UUID(), userName: "user1", password: "1234", roles: ["USER"] });
    this.users.push({ userId: UUID.UUID(), userName: "user2", password: "1234", roles: ["USER"] });
    this.users.push({ userId: UUID.UUID(), userName: "admin", password: "1234", roles: ["USER", "ADMIN"] });
    console.log(this.users[0]);
  }
  public login(username: string, password: string): Observable<AppUser> {
    let appUser = this.users.find(u => u.userName == username);
    if (!appUser) return throwError(() => new Error("nom d'utilisateur et/ou mot de passe sont incorrectes"));
    if (appUser.password != password) { return throwError(() => new Error("nom d'utilisateur et/ou mot de passe sont incorrectes")); }
    return of(appUser);
  }
  public authenticateUser(appUser: AppUser): Observable<boolean> {
    this.authenticatedUser = appUser;
    localStorage.setItem("authUser", JSON.stringify({ username: appUser.userName, roles: appUser.roles, jwt: "JWT_TOKEN" }));
    return of(true);
  }
  public hasRole(role: string): boolean {
    return this.authenticatedUser!.roles.includes(role);
  }
  public isAuthenticated() {
    return this.authenticatedUser != undefined;
  }
 
}
