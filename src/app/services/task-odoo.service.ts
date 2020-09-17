import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'
import {TaskModel} from '../models/task.model'

let odooClient = new odoo_xmlrpc({
    url: 'http://' + '192.168.1.15',
    port: 8069,
    db: 'demo',
    username: '',
    password: '',
});

@Injectable({
    providedIn: 'root'
  })
  export class TaskOdooService {

    TasksList:TaskModel[];
    task:TaskModel;
    user:UsuarioModel

    constructor(){
        
    }
    setUser(usuario:UsuarioModel){
        this.user=usuario;
        odooClient.username = usuario.username;
        odooClient.password = usuario.password;
    }

    newTask(){
        
        let createService=function(){
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
    
            let inParams = [];
            inParams.push(SO);
            let params = [];
            params.push(inParams)
            odooClient.execute_kw('sale.order', 'create', params, function (err, value) {
                if (err) {
                    console.log(err);
                } else {
                    //flow.set('SO',value)
                    console.log(value);
                    inParams = []
                    inParams.push(value)
                    params = []
                    params.push(inParams)
                    odooClient.execute_kw('sale.order', 'action_confirm', params, function (err, value) {
                        if (err) {
                        console.log(err);
                        
                    } else {
                        console.log(value);
                        
                    }
                    });
                }
            });
        }
        odooClient.connect(function (err) {
            if (err) { 
                console.log(err);
            } else {
                
                createService();                
            }
        });
    }

    acceptProvider(id:number){
        
        let confirm_PO = function() {
            const id_po = id
            let inParams = []
            inParams.push([id_po])
            //inParams.push([69])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'button_confirm', params, function (err, value) {
                if (err) {
                    console.log(err);
                    
                } else {
                    console.log(value);
                    
                }
            })
        }
        
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err);
                
            } else {
                console.log(value);            
                confirm_PO(); 
            }
        });
    }

    declineProvider(id:number){
        
        let cancel_PO = function() {
            const id_po = id
            let inParams = []
            inParams.push([id_po])
            //inParams.push([69])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'button_cancel', params, function (err, value) {
                if (err) {
                    console.log(err);
                    
                } else {
                    console.log(value);
                }
            })
        }
        
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err);
                
            } else {
                console.log(value);            
                cancel_PO(); 
            }
        });
    }
  }