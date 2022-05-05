import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardGuards implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private snackbar: MatSnackBar
  ) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.loginService.isAuthenticated().pipe(
      tap((auth) => {
        if (!auth) {
          this.router.navigateByUrl('/');
          this.snackbar.open('Você não fez seu login ainda!', 'ok', {
            duration: 5000,
          });
        }
      })
    );
  }
}
