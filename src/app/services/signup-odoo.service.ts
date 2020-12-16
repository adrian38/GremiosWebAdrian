import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model'
import { Observable, Subject } from 'rxjs';
let jayson = require('../../../node_modules/jayson/lib/client/');

// let host = '192.168.0.106';
let host = 'todoenunapp.com';
let port = 8069;
let db = 'demo';
let user = 'root';
let pass = 'root';

let notificationError$ = new Subject<boolean>();

let notificationOK$ = new Subject<boolean>();


@Injectable({
  providedIn: 'root'
})
export class SignUpOdooService {

  constructor() { }

  getNotificationError$(): Observable<boolean> {
    return notificationError$.asObservable();
  }

  getNotificationOK$(): Observable<boolean> {
    return notificationOK$.asObservable();
  }

  newUser(usuario: UsuarioModel) {

    console.log(usuario, 'sigupClient');

    let user_to_create;
    let partner_update;

    if (usuario.type === "client") {

      user_to_create = {
        'name': usuario.realname,
        'classification': 'custumer',// puede ser 'custumer','vendor' o 'admin'
        'login': usuario.username,
        'email': usuario.username,
        'password': usuario.password,
        'groups_id': [22, 1, 11, 17, 34, 23, 6, 35, 20, 19]
        /* groups_id son los mismos para custumer y vendor para admin son: [2,21,36,22,26,7,1,11,17,34,3,23,6,35,20,19]*/

      }

      partner_update = {
        'date': '1992-08-10', //birthdate
        'address_street': 'Av. de Monforte de Lemos',
        'address_floor': '1',
        'address_portal': '',
        'address_number': '36',
        'address_door': '21',
        'address_stairs': '',
        'address_zip_code': '28029',
        'address_latitude': '40,47558',
        'address_longitude': '-3,68992',
        'mobile': usuario.phone,

      }

    }

    let set_partner_update = function () {

      console.log(usuario.partner_id);

      let inParams = []
      inParams.push([usuario.partner_id]); //id to update
      inParams.push(partner_update);
      let params = []
      params.push(inParams)

      let fparams = [];
      fparams.push(db);
      fparams.push(1);
      fparams.push(pass);
      fparams.push('res.partner');//model
      fparams.push('write');//method

      for (let i = 0; i < params.length; i++) {
        fparams.push(params[i]);
      }

      client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        if (err) {
          console.log(err, "Error actualizando campos usuario");
          notificationError$.next(true);
        } else {

          console.log("actualizando campos usuario exito");
          notificationOK$.next(true);

        }
      })
    }



    let get_user = function (id: number) {
      let inParams = []
      inParams.push([['id', '=', id]])
      inParams.push([
        'partner_id',
      ])
      let params = []
      params.push(inParams)

      let fparams = [];
      fparams.push(db);
      fparams.push(id);
      fparams.push(usuario.password);
      fparams.push('res.users');//model
      fparams.push('search_read');//method

      for (let i = 0; i < params.length; i++) {
        fparams.push(params[i]);
      }

      client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        if (err || !value) {
          console.log(err, "Error get_user");
          notificationError$.next(true);
        } else {
          usuario.partner_id = value[0].partner_id[0];
          set_partner_update();
        }
      });
    }

    let path = '/jsonrpc'
    let client = jayson.http('http://' + host + ':' + port + path)

    let inParams = []
    inParams.push(user_to_create)
    let params = []
    params.push(inParams)

    let fparams = [];
    fparams.push(db);
    fparams.push(1);
    fparams.push(pass);
    fparams.push('res.users');//model
    fparams.push('create');//method

    for (let i = 0; i < params.length; i++) {
      fparams.push(params[i]);
    }

    client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
      if (err || !value) {
        console.log(err, "Error creando usuario o el usuario ya existe");
        notificationError$.next(true);
      } else {
        console.log(value, "Exito creando el usuario");
        get_user(value);
      }
    });



  }



}