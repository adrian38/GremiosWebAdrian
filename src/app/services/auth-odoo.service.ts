import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'
import {Observable, Subject} from 'rxjs'

let odooClient = new odoo_xmlrpc({
  url: 'http://' + '10.23.20.10',
  port: 8069,
  db: 'demo',
  username: '',
  password: '',
});

let connected$ = new Subject<boolean>();
let connected: boolean=false;
let user:any;

@Injectable({
  providedIn: 'root'
})
export class AuthOdooService {

  /* odooClient: odoo_xmlrpc; */
  username:string ="";
  password:string ="";
  userType:string="";



  constructor() { }


  login(usuario:UsuarioModel):void{

    odooClient.username = usuario.username;
    odooClient.password = usuario.password;

    let get_user = function(id:number) {
      let inParams = []
      inParams.push([id])
      inParams.push(['partner_id'])
      let params = []
      params.push(inParams)
      odooClient.execute_kw('res.users', 'read', params, function (err, value) {
          if (err) {
              console.log(err);
          } else {
              console.log(value);
              user=value;
              get_type_user(value[0]['partner_id'][0]);
          }
      })
    }

    let get_type_user = function(id:number) {
      let inParams = []
      inParams.push([id])
      inParams.push(['supplier_rank', 'customer_rank'])
      let params = []
      params.push(inParams)
      odooClient.execute_kw('res.partner', 'read', params, function (err, value) {
          if (err) {
              console.log(err);
          } else {
              console.log(value);
              user.push(value);
          }
      })
    }


    odooClient.connect(function (err, value){
      if (err) {
        console.log("Login Failed");
        console.log(err);
        usuario.connected = false;
      } else {
        console.log("Login Success");
        usuario.connected = true;
        console.log(value);
        get_user(value);
      }
      connected$.next(connected);
    });
  }

  isConnected():boolean{
    return connected;
  }

  getConnected$(): Observable<boolean>{
    return connected$.asObservable();
  }

  getUser(){
    if(user[1][0].customer_rank > 0){
      this.userType = "client";
    }else if(user[1][0].supplier_rank > 0){
      this.userType = "provider";
    }
    return user;
  }

}
