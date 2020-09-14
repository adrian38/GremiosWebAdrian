import { Component, OnInit } from '@angular/core';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  servicio:string="";

  constructor(private _authOdoo:AuthOdooService) { }

  ngOnInit(): void {
  }
  
  userConnected(){
    return this._authOdoo.isConnected();
  }

  solicitudes(){

  }
  contratados(){
    
  }
  terminados(){
    
  }

  newService (service:string){
      this.servicio = service;
      
  }
}