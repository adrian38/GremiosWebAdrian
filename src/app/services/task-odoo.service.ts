import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'
import {TaskModel} from '../models/task.model'

let odooClient = new odoo_xmlrpc({
    url: 'http://' + '192.168.1.15',
    port: 8069,
    db: 'demo',
    username: 'alan@example.com',
    password: 'alan',
});

let task:any;
let id_origin:number;
let tasksList:any;
let ID:any;
let taskProvider:any;

@Injectable({
    providedIn: 'root'
  })
  export class TaskOdooService {

    
    user:UsuarioModel;
    

    constructor(){
        
    }
    setUser(usuario:UsuarioModel, id){
        this.user=usuario;
        odooClient.username = usuario.username;
        odooClient.password = usuario.password;
        ID = id;

    }

    newTask(desc:string, type:string){
        
        let createService=function(){
            let SO = {
                'company_id': 1,
                'client_order_ref':type, 
                'order_line': [[0,0,{
                    'name': 'Servicio de Fontaneria', 
                    'price_unit': 0.0, 
                    'product_id': 39, 
                    'product_uom': 1, 
                    'product_uom_qty': 1.0, 
                    'state': 'draft'
                }]],
                'note':desc,
                'partner_id': ID[0]['partner_id'][0],           
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

    editTask(desc:string){
        
    }

    acceptProvider(id:number){
        
        let confirm_PO = function() {
            const id_po = id
            let inParams = []
            inParams.push([id_po])
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

    requestTask(id:number){
        
        let get_po_by_id = function() {
            const id_po = id
            let inParams = []
            inParams.push([['id', '=', id_po]])
            inParams.push(['partner_id', 'amount_total', 'order_line', 'user_id', 'date_order', 'origin'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'search_read', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    console.log(value);
                    task = value;
                    id_origin = task[0].origin;                               
                }
            })
        }

        let get_desc_so = function(id) {
            let inParams = []
            inParams.push([['name', '=', id]])
            inParams.push(['note'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('sale.order', 'search_read', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    console.log(value);
                    task.push(value[0]);
                    console.log(task);
                               
                }
            })
        }
          
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(value);
                get_po_by_id();
                setTimeout(() => {                       
                    get_desc_so(id_origin);
                }, 1000);                  
            }
        });
    }

    getRequestedTask(){
        return task;
    }

    requestTaskList(){
        let get_so_list = function(id) {
            let inParams = []
            inParams.push([['partner_id', '=', id]])
            inParams.push(['partner_id','name','note', 'date_order', 'client_order_ref'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('sale.order', 'search_read', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    //console.log(value);
                    tasksList=value;                              
                }
            })
        }
          
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(value);
                get_so_list(ID[0]['partner_id'][0]);                 
            }
        });
    }

    getRequestedTaskList(){
        return tasksList;
    }

    requestProvidersForTask(id){
        let get_po_of_task = function() {
            let inParams = []
            inParams.push([['origin', '=', id]])
            inParams.push(['partner_id', 'amount_total', 'user_id', 'date_order', 'origin'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'search_read', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    console.log(value);
                    taskProvider=value;                
                }
            })
        }
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(value);
                get_po_of_task();                 
            }
        });
    }

    getOffers(){
        return taskProvider;
    }
  }