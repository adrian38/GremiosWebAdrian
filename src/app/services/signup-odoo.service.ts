import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'

@Injectable({
    providedIn: 'root'
  })
export class SignUpOdooService {

    constructor() {}

    newUser(usuario:UsuarioModel){
        
    }
}