import { Injectable } from '@angular/core';
import *as odoo_xmlrpc from 'odoo-xmlrpc';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClientModule } from '@angular/common/http';

let connected = false;
let uid : number;

@Injectable({
  providedIn: 'root'
})
export class AuthOdooService {

  public odooClient = new odoo_xmlrpc({
    url: 'http://127.0.0.1',
    port: '8069',
    db: 'demo',
    username: '',
    password: '',
  });

  constructor() {
  }

  login(username: string , password: string): void{

    this.odooClient.username = username;
    this.odooClient.password = password;
    console.log(this.odooClient);
    this.odooClient.connect(function(error,value){
      if (error)
      { connected = false;
        console.log('fail');
      }else{
        uid = value;
        connected = true;
      }
    });
  }

  isConnected(): boolean{
    if(connected === true)
    {
      return true;
    }
    else{
      return false;
    }
  }

  sendUid(): number {
    if (connected === true)
    {
      return uid;
    } else
    {
      return 0;
    }
  }
}
