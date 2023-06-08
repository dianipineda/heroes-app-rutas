import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  //metodo para centralizar las funciones de CanLoad y CanActivate
  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap((isAuthenticated) =>
        console.log('¿Esta autenticado? ', isAuthenticated)
      ),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['./auth']);
        }
      })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    //console.log('valores de canLoad', route, segments);
    return this.checkAuthStatus();
    //throw new Error('Method not implemented.');
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    //console.log('valores de CanActivate', route, state);
    return this.checkAuthStatus();
    //throw new Error('Method not implemented.');
  }
}
