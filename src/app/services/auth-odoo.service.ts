import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model'
import { Observable, Subject } from 'rxjs'
let jayson = require('../../../node_modules/jayson/lib/client/');
let jaysonServer = {
 // host: '192.168.0.106',
  host: 'todoenunapp.com',
  port: '8069',
  db: 'demo',
  username: '',
  password: '',
  pathConnection: '/jsonrpc'
}


let user$ = new Subject<UsuarioModel>();
let connected: boolean = false;
let userLogin: UsuarioModel = new UsuarioModel();

@Injectable({
  providedIn: 'root'
})
export class AuthOdooService {

  userType: string = "";

  public OdooInfoJayson = jaysonServer;

  constructor() {

  }

  ///////////////login desde la web
  login(usuario: UsuarioModel): void {

     jaysonServer.username = usuario.username;
    jaysonServer.password = usuario.password;

    let get_user = function (id: number) {
      let inParams = []
      inParams.push([['id', '=', id]])
      inParams.push([
        'name',
        'login',
        'email',
        'partner_id',
        'groups_id',
        'image_1920',
        'classification'
      ])
      let params = []
      params.push(inParams)

      let fparams = [];
      fparams.push(jaysonServer.db);
      fparams.push(id);
      fparams.push(jaysonServer.password);
      fparams.push('res.users');//model
      fparams.push('search_read');//method

      for (let i = 0; i < params.length; i++) {
        fparams.push(params[i]);
      }

      client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        if (err || !value) {
          console.log(err , "Error get_user");
        } else {

          usuario.partner_id = value[0].partner_id[0];
          usuario.realname = value[0].name;

          /*             if(value[0].classification === "custumer")
                        {
                          usuario.type = "client"
                          console.log("cliente");
          
                        } else if(value[0].classification === "vendor")
                        {
                          usuario.type = "provider"
                          console.log("proveedor");
                        } */

                        if(value[0].classification === "custumer")
                        {
                          usuario.type = "client"
                          console.log("cliente");
          
                        } else 
                        {
                          usuario.type = "provider"
                          console.log("proveedor");
                        }
          user$.next(userLogin);
        }
      });
    }
    let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
    client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

      if (err || !value) {
        console.log("Login Failed");
        //console.log(err);
        usuario.connected = false;
        userLogin = usuario;
        user$.next(userLogin);;
      } else {
        console.log("Connected");
        usuario.connected = true;
        usuario.id = value;
        connected = usuario.connected;
        userLogin = usuario;
        get_user(usuario.id);
      }
    });
  }

  //////////////////////////////////////////////////

  //Login desde la apk de cliente

  loginClientApk(usuario: UsuarioModel): void {

    jaysonServer.username = usuario.username;
    jaysonServer.password = usuario.password;

    let get_user = function (id: number) {
      let inParams = []
      inParams.push([['id', '=', id]])
      inParams.push([
        'name',
        'login',
        'email',
        'partner_id',
        'groups_id',
        'image_1920',
        'classification'
      ])
      let params = []
      params.push(inParams)

      let fparams = [];
      fparams.push(jaysonServer.db);
      fparams.push(id);
      fparams.push(jaysonServer.password);
      fparams.push('res.users');//model
      fparams.push('search_read');//method

      for (let i = 0; i < params.length; i++) {
        fparams.push(params[i]);
      }

      client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        if (err || !value) {
          console.log(err , "Error get_user");
        } else {

          

                         if(value[0].classification === "custumer")
                        {
                          usuario.type = "client"
                          console.log("cliente");
                          usuario.connected = true;
                          usuario.id = id;
                          connected = usuario.connected;
                          usuario.partner_id = value[0].partner_id[0];
                          usuario.realname = value[0].name;
                          userLogin = usuario;
          
                        } else 
                        {
                          usuario.connected = false;
                          connected = usuario.connected;
                        }
          user$.next(userLogin);
        }
      });
    }
    let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
    client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

      if (err || !value) {
        console.log("Login Failed");
        console.log(err);
        usuario.connected = false;
        userLogin = usuario;
        user$.next(userLogin);;
      } else {
        console.log("Connected");
        
        get_user(value);
      }
    });
  }



  //////////////////////////////////////////////////

  getUser$(): Observable<UsuarioModel> {
    return user$.asObservable();
  }

  getUser(): UsuarioModel {
    return userLogin;
  }

}
