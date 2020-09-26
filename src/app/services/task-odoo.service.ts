import { Injectable, Testability } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'
import {TaskModel} from '../models/task.model'
import {Observable, Subject} from 'rxjs';
import { AuthOdooService } from './auth-odoo.service';

let odooClient;

let task:TaskModel;
let task$ = new Subject<TaskModel>();

let tasksList:TaskModel[];
let tasksList$ = new Subject<TaskModel[]>();

let offersList:TaskModel[];
let offersList$ = new Subject<TaskModel[]>();

let user:UsuarioModel;

@Injectable({
    providedIn: 'root'
  })
  export class TaskOdooService {
    constructor(private _authOdoo:AuthOdooService){
        task = new TaskModel();
      odooClient = this._authOdoo.OdooInfo;
    }

    setUser(usuario:UsuarioModel){
        user=usuario;
    }

    newTask(task:TaskModel){
        
        let createService=function(){
            let SO = {
                'company_id': 1,
                'client_order_ref':task.type, 
                'order_line': [[0,0,{
                    'name': 'Servicio de Fontaneria', 
                    'price_unit': 0.0, 
                    'product_id': 39, 
                    'product_uom': 1, 
                    'product_uom_qty': 1.0, 
                    'state': 'draft'
                }]],
                'note':task.description,
                'partner_id': task.client_id,           
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
            inParams.push(['partner_id', 'amount_total', 'user_id', 'origin'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'search_read', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    console.log(value);
                    task.budget = value[0]['amount_total'];
                    task.client_id = value[0]['user_id'][0];
                    task.client_name = value[0]['user_id'][1];
                    task.provider_id = value[0]['partner_id'][0];
                    task.provider_name = value[0]['partner_id'][1];
                    task.id = id;
                    task.origin = value[0]['origin'];
                    console.log(task);
                    get_desc_so(task.origin);                               
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
                    task.description = value[0]['note'];
                    console.log(task);
                    task$.next(task);                    
                }
            })
        }
          
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(value);
                get_po_by_id();                                     
            }
        });
    }

    getRequestedTask$(): Observable<TaskModel>{
        return task$.asObservable();
    }

    requestTaskListClient(){
        let get_so_list = function(id) {
            let inParams = []
            inParams.push([['partner_id', '=', id]])
            inParams.push(['partner_id','name','note', 'client_order_ref'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('sale.order', 'search_read', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    //console.log(value);
                    tasksList = [];              
                    for(let order of value){
                        let temp = new TaskModel();
                        temp.description = order['note'];
                        temp.type = order['client_order_ref'];
                        temp.client_id = order['partner_id'][0];
                        temp.client_name = order['partner_id'][1];
                        temp.id_string = order['name'];
                        temp.id = order['id'];
                        tasksList.push(temp);
                    } 
                    tasksList$.next(tasksList);                        
                }
            })
        }
          
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(value);                
                get_so_list(user.partner_id);
            }
        });
    }

    requestTaskListProvider(){
        let get_po_list = function(id) {
            let inParams = []
            inParams.push([['partner_id', '=', id]])
            inParams.push(['user_id','partner_id','name', 'date_order'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'search_read', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    console.log(value);
                    tasksList=[];
                    for(let task of value) {
                        let temp  = new TaskModel();
                        temp.client_id = task['user_id'][0];
                        temp.client_name = task['user_id'][1];
                        temp.provider_id = task['partner_id'][0];
                        temp.provider_name = task['partner_id'][1];
                        temp.id = task['id'];
                        temp.id_string = task['name'];
                        temp.date_planned = task['date_order'];
                        tasksList.push(temp);
                    }
                    tasksList$.next(tasksList);       
                }
            })
        }
          
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(value);
                get_po_list(user.partner_id);
            }
        });
    }

    getRequestedTaskList$(): Observable<TaskModel[]>{
        return tasksList$.asObservable();
    }

    requestOffersForTask(id){
        let get_po_of_task = function() {
            let inParams = []
            inParams.push([['origin', '=', id]])
            inParams.push(['partner_id', 'amount_total', 'user_id', 'origin'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'search_read', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    //console.log(value);
                    offersList = [];
                    for (let offer of value){
                        let temp  = new TaskModel();
                        temp.client_id = offer['user_id'][0];
                        temp.client_name = offer['user_id'][1];
                        temp.provider_id = offer['partner_id'][0];
                        temp.provider_name = offer['partner_id'][1];
                        temp.id = offer['id'];
                        temp.id_string = offer['name'];
                        temp.budget = offer['amount_total'];
                        temp.origin = offer['origin'];
                        offersList.push(temp);
                    }
                    //console.log(offersList);                    
                    offersList$.next(offersList);          
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

    getOffers$(): Observable<TaskModel[]>{
        return offersList$.asObservable();
    }

    sendOffer(offer:TaskModel){
        let POline = {
            'name':'Presupuesto',
            'product_id': 39,
            'product_uom': 1,
            'product_qty': 1,
            'price_unit': offer.budget,
            'date_planned': offer.date_planned,
            'order_id': offer.id,
        }        

        let addLinePO = function() {
            
            console.log(POline);
            
            let inParams = []
            inParams.push(POline)
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order.line', 'create', params, function (err, value) {
                if (err) {
                    console.log(err);                         
                } else {
                    console.log(value);                                  
                }
            });
        }
                                                            
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err);    
            } else {
                console.log(value);                      
                addLinePO()
            }
        });
    }
  }