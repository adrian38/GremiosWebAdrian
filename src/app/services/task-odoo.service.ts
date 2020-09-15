import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'
import {TaskModel} from '../models/task.model'


@Injectable({
    providedIn: 'root'
  })
  export class TaskOdooService {

    odooClient: odoo_xmlrpc;
    username:string ="";
    password:string ="";

    task:TaskModel;
    user:UsuarioModel

    constructor(){

        const host = '127.0.0.1'
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
    setUser(usuario:UsuarioModel){
        this.user=usuario;
        this.odooClient.username = usuario.username;
        this.odooClient.password = usuario.password;
    }

    newTask(){
        let SO = {
            'company_id': 1, 
            'order_line': [[0,0,{
                'name': 'Servicio de Fontaneria', 
                'price_unit': 0.0, 
                'product_id': 39, 
                'product_uom': 1, 
                'product_uom_qty': 1.0, 
                'state': 'draft'
            }]],
            'partner_id': 44,
            'require_payment': false, 
            'require_signature': false,
            'state': 'draft'
        }
    }
  }