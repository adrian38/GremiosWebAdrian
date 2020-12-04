import { Injectable } from '@angular/core';
import {UsuarioModel} from '../models/usuario.model'
import { Observable, Subject } from 'rxjs';
let jayson = require('../../../node_modules/jayson/lib/client/');

let host = '192.168.0.106';
//let host = 'todoenunapp.com';
let port = 8069;
let db = 'demo';
let user = 'root';
let pass = 'root';


@Injectable({
    providedIn: 'root'
  })
export class SignUpOdooService {

    constructor() {}

    newUserClient(usuario:UsuarioModel){

        console.log(usuario,'sigupClient');

      let user_to_create = {
        'name':usuario.realname,
        'classification':'custumer',// puede ser 'custumer','vendor' o 'admin'
        'login':usuario.username,
        'email':usuario.username,
        'password':usuario.password,
        'groups_id':[22,1,11,17,34,23,6,35,20,19]
        /* groups_id son los mismos para custumer y vendor para admin son: [2,21,36,22,26,7,1,11,17,34,3,23,6,35,20,19]*/
   
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
    
    for(let i = 0; i <params.length; i++){
        fparams.push(params[i]);
    }

    client.request('call', {service:'object', method:'execute_kw', args:fparams}, function(err, error, value) {
        if(err || !value){
            console.log(err,"Error creando usuario o el usuario ya existe"); 
        } else {
            console.log(value,"Exito creando el usuario"); 
        }
    });



}


newUserProvider(usuario:UsuarioModel){

    console.log(usuario,'sigupClient');

  let user_to_create = {
    'name':usuario.realname,
    'classification':'vendor',// puede ser 'custumer','vendor' o 'admin'
    'login':usuario.username,
    'email':usuario.username,
    'password':usuario.password,
    'groups_id':[22,1,11,17,34,23,6,35,20,19]
    /* groups_id son los mismos para custumer y vendor para admin son: [2,21,36,22,26,7,1,11,17,34,3,23,6,35,20,19]*/

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

for(let i = 0; i <params.length; i++){
    fparams.push(params[i]);
}

client.request('call', {service:'object', method:'execute_kw', args:fparams}, function(err, error, value) {
    if(err || !value){
        console.log(err,"Error creando usuario o el usuario ya existe"); 
    } else {
        console.log(value,"Exito creando el usuario"); 
    }
});



}



}