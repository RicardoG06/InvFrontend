import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClienteService } from "src/app/services/cliente.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( 
    private _adminService: ClienteService, 
    private _router: Router
  ){
  }
  //Te permite entrar al home solo si estas logueado o encuentra un token , de lo contrario te regresara al login
  canActivate():any{
    if(!this._adminService.isAuthenticated()){
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
  
}
