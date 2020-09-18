import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'


let connected: boolean=false;
let user:any;

@Injectable({
  providedIn: 'root'
})
export class AuthOdooService {

  odooClient: odoo_xmlrpc;
  username:string ="";
  password:string ="";

  constructor() {

    const host = '192.168.1.15'
    const port=8069;
    const db = 'demo';

    this.odooClient = new odoo_xmlrpc({
      url: 'http://' + host,
      port: port,
      db: db,
      username: this.username,
      password: this.password,
    });
  }

  login(usuario:UsuarioModel):void{

    this.odooClient.username = usuario.username;
    this.odooClient.password = usuario.password;

    let get_user = function(id:number) {
      let inParams = []
      inParams.push([id])
      inParams.push([['res_partner', '=', id]])
      inParams.push(['name'])
      let params = []
      params.push(inParams)
      this.odooClient.execute_kw('res.partner', 'search', params, function (err, value) {
          if (err) {
              console.log(err);  
          } else {
              console.log(value);
          }
      })
  }
        
    this.odooClient.connect(function (err, value){
      if (err) { 
        console.log("Login Failed");
        console.log(err);
        connected = false;
      } else {
        console.log("Login Success");
        connected = true;
        console.log(value);
        
        get_user(value);
      }
    });
  }

  isConnected():boolean{  
    return connected;      
  }
}
