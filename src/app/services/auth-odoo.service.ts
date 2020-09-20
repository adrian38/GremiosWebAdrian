import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'

let odooClient = new odoo_xmlrpc({
  url: 'http://' + '192.168.1.15',
  port: 8069,
  db: 'demo',
  username: '',
  password: '',
});


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

  constructor() {

    const host = '192.168.1.15'
    const port=8069;
    const db = 'demo';

    /* this.odooClient = new odoo_xmlrpc({
      url: 'http://' + host,
      port: port,
      db: db,
      username: this.username,
      password: this.password,
    }); */
  }

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
              setTimeout(() => {
                user=value;
                get_type_user(value[0]['partner_id'][0]);                
              }, 1000);
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
              setTimeout(() => {
                user.push(value);                  
              }, 1000);
          }
      })
    }

        
    odooClient.connect(function (err, value){
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

  getUser(){
    if(user[1][0].customer_rank > 0){  
      this.userType = "client";
    }else if(user[1][0].supplier_rank > 0){
      this.userType = "provider";
    }
    return user;
  }

}
