import { Injectable, Testability } from '@angular/core';
import * as xmlrpc from 'node_modules/xmlrpc/lib/client'
import { UsuarioModel } from '../models/usuario.model'
import { Address, TaskModel } from '../models/task.model'
import { Observable, Subject } from 'rxjs';
import { AuthOdooService } from './auth-odoo.service';
import { HttpClient } from '@angular/common/http';
import { StringDecoder } from 'string_decoder';
let jayson = require('../../../node_modules/jayson/lib/client/');

let odooClient;

let jaysonServer;


let task: TaskModel;
let task$ = new Subject<TaskModel>();

let tasksList: TaskModel[];
let tasksList$ = new Subject<TaskModel[]>();

let offersList: TaskModel[];
let offersList$ = new Subject<TaskModel[]>();

let user: UsuarioModel;

@Injectable({
    providedIn: 'root'
})
export class TaskOdooService {
    selectedTab: String;
    selectedTab$ = new Subject<String>();

    constructor(private _authOdoo: AuthOdooService) {
        task = new TaskModel();

        odooClient = this._authOdoo.OdooInfo;
        jaysonServer = this._authOdoo.OdooInfoJayson;
    }

    setUser(usuario: UsuarioModel) {
        user = usuario;
    }

    getUser() {
        return user;
    }

    cancelPOsuplier(id: number) {

        let get_po_list = function (partnerId) {
            let inParams = []
            inParams.push([['partner_id', '=', partnerId]])
            inParams.push(['user_id', 'partner_id', 'name', 'date_order', 'invoice_status'])

            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err || !value) {
                    console.log(err, "get_po_list");
                } else {
                    console.log(value);
                    tasksList = [];
                    for (let task of value) {
                        let temp = new TaskModel();
                        temp.client_id = task['user_id'][0];
                        temp.client_name = task['user_id'][1];
                        temp.provider_id = task['partner_id'][0];
                        temp.provider_name = task['partner_id'][1];
                        temp.id = task['id'];
                        temp.state = task['invoice_status'];
                        temp.id_string = task['name'];
                        temp.date_planned = task['date_order'];
                        tasksList.push(temp);
                    }
                    tasksList$.next(tasksList);
                }
            })
        }

        let cancelPOsuplierSelected = function () {

            let inParams = []
            inParams.push([id])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('button_cancel');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err) {
                    console.log(err, "Error cancelPOsuplierSelected");
                } else {
                   // console.log(user.id);
                   // console.log(id);
                    console.log(value);
                    get_po_list(user.partner_id);

                }
            });
        }
        

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error cancelPOsuplier");

            } else {
                cancelPOsuplierSelected();
            }
        });

    }

    cancelSOclient(id: number) {

        let get_so_list = function (partnerId) {
            let inParams = []
            inParams.push([['partner_id', '=', partnerId]])
            inParams.push(['partner_id', 'name', 'note', 'invoice_status', 'client_order_ref', 'title', 'require_materials',
                'commitment_date', 'address_street', 'address_floor', 'address_portal',
                'address_number', 'address_door', 'address_stairs', 'address_zip_code',
                'address_latitude', 'address_longitude'])


            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err) {
                    console.log(err || !value, "get_so_list");
                } else {
                    console.log(value);
                    tasksList = [];
                    for (let order of value) {
                        let temp = new TaskModel();
                        temp.description = order['note'];
                        temp.type = order['client_order_ref'];
                        temp.client_id = order['partner_id'][0];
                        temp.client_name = order['partner_id'][1];
                        temp.id_string = order['name'];
                        temp.id = order['id'];
                        temp.title = order['title'];
                        temp.require_materials = order['require_materials'];
                        temp.state = order['invoice_status'];
                        temp.date = String(order['commitment_date']).slice(0, 10);
                        temp.time = String(order['commitment_date']).slice(10, String(order['commitment_date']).length);
                        temp.address = new Address(order['address_street'],
                            order['address_number'],
                            order['address_portal'],
                            order['address_stairs'],
                            order['address_floor'],
                            order['address_door'],
                            order['address_zip_code'],
                            order['address_latitude'],
                            order['address_longitude'])
                        tasksList.push(temp);
                    }
                    tasksList$.next(tasksList);
                }
            })
        }

        let cancelSOclientSelected = function () {

            let inParams = []
            inParams.push([id])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order');//model
            fparams.push('action_cancel');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    console.log(err, "Error cancelSOclientSelected");
                } else {
                    console.log(user.id);
                /*     console.log(id);
                    console.log(value); */
                    get_so_list(user.partner_id);
                }
            });
        }
        

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error cancelSOclient");

            } else {
                cancelSOclientSelected();
            }
        });

    }

    newTask(task: TaskModel) {

        let get_so_list = function (partnerId) {
            let inParams = []
            inParams.push([['partner_id', '=', partnerId]])
            inParams.push(['partner_id', 'name', 'note', 'invoice_status', 'client_order_ref', 'title', 'require_materials',
                'commitment_date', 'address_street', 'address_floor', 'address_portal',
                'address_number', 'address_door', 'address_stairs', 'address_zip_code',
                'address_latitude', 'address_longitude'])


            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err) {
                    console.log(err || !value, "get_so_list");
                } else {
                    console.log(value);
                    tasksList = [];
                    for (let order of value) {
                        let temp = new TaskModel();
                        temp.description = order['note'];
                        temp.type = order['client_order_ref'];
                        temp.client_id = order['partner_id'][0];
                        temp.client_name = order['partner_id'][1];
                        temp.id_string = order['name'];
                        temp.id = order['id'];
                        temp.title = order['title'];
                        temp.require_materials = order['require_materials'];
                        temp.state = order['invoice_status'];
                        temp.date = String(order['commitment_date']).slice(0, 10);
                        temp.time = String(order['commitment_date']).slice(10, String(order['commitment_date']).length);
                        temp.address = new Address(order['address_street'],
                            order['address_number'],
                            order['address_portal'],
                            order['address_stairs'],
                            order['address_floor'],
                            order['address_door'],
                            order['address_zip_code'],
                            order['address_latitude'],
                            order['address_longitude'])
                        tasksList.push(temp);
                    }
                    tasksList$.next(tasksList);
                }
            })
        }

        let createService = function () {

            console.log(task);
            let SO = {


                'company_id': 1,
                'client_order_ref': task.type,
                'order_line': [[0, 0, {
                    'name': 'Servicio de Fontaneria',
                    'price_unit': 0.0,
                    'product_id': 39,
                    'product_uom': 1,
                    'product_uom_qty': 1.0,
                    'state': 'draft'
                }]],
                'note': task.description,
                'partner_id': task.client_id,
                'title': task.title,
                'commitment_date': (task.date + ' ' + task.time),
                'require_materials': task.require_materials,
                'require_payment': false,
                'require_signature': false,
                'state': 'draft',
                'address_street': task.address.street,
                'address_floor': task.address.floor,
                'address_portal': task.address.portal,
                'address_number': task.address.number,
                'address_door': task.address.door,
                'address_stairs': task.address.stair,
                'address_zip_code': task.address.cp,
                'address_latitude': '',
                'address_longitude': '',
            }
            let inParams = [];
            inParams.push(SO);
            let params = [];
            params.push(inParams)
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order');//model
            fparams.push('create');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    console.log(err, "createService");

                } else {
                    console.log(value, "createService");
                    inParams = []
                    inParams.push(value)
                    params = []
                    params.push(inParams)
                    let fparams = [];
                    fparams.push(jaysonServer.db);
                    fparams.push(user.id);
                    fparams.push(jaysonServer.password);
                    fparams.push('sale.order');//model
                    fparams.push('action_confirm');//method

                    for (let i = 0; i < params.length; i++) {
                        fparams.push(params[i]);
                    }

                    client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                        if (err || !value) {
                            console.log(err, "Error Confirmar Servicio Creado");
                        } else {
                            console.log(value, "Confirmar Servicio Creado");

                            get_so_list(user.partner_id);


                            
                        }
                    });
                }
            });
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "newTask");

            } else {
                createService();
            }
        });

    }

    editTask(desc: string) {

    }

    acceptProvider(PO_id: number, SO_id : number) {

        let get_so_list = function (partnerId) {
            let inParams = []
            inParams.push([['partner_id', '=', partnerId]])
            inParams.push(['partner_id', 'name', 'note', 'invoice_status', 'client_order_ref', 'title', 'require_materials',
                'commitment_date', 'address_street', 'address_floor', 'address_portal',
                'address_number', 'address_door', 'address_stairs', 'address_zip_code',
                'address_latitude', 'address_longitude'])


            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err) {
                    console.log(err || !value, "get_so_list");
                } else {
                    console.log(value);
                    tasksList = [];
                    for (let order of value) {
                        let temp = new TaskModel();
                        temp.description = order['note'];
                        temp.type = order['client_order_ref'];
                        temp.client_id = order['partner_id'][0];
                        temp.client_name = order['partner_id'][1];
                        temp.id_string = order['name'];
                        temp.id = order['id'];
                        temp.title = order['title'];
                        temp.require_materials = order['require_materials'];
                        temp.state = order['invoice_status'];
                        temp.date = String(order['commitment_date']).slice(0, 10);
                        temp.time = String(order['commitment_date']).slice(10, String(order['commitment_date']).length);
                        temp.address = new Address(order['address_street'],
                            order['address_number'],
                            order['address_portal'],
                            order['address_stairs'],
                            order['address_floor'],
                            order['address_door'],
                            order['address_zip_code'],
                            order['address_latitude'],
                            order['address_longitude'])
                        tasksList.push(temp);
                    }
                    tasksList$.next(tasksList);
                }
            })
        }
        
        
        let create_PO_invoice = function() {

            let inParams = []
            inParams.push([PO_id])
            let params = []
            params.push(inParams) 
            
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('create_full_invoice');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        
                if (err || !value) {
                console.log(err,"Error create_PO_invoice");
            } else {
                console.log("SO contratada");
                get_so_list(user.partner_id);
                }
            });

        }
        
        let create_SO_invoice = function() {

            let inParams = []
            inParams.push([SO_id])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order');//model
            fparams.push('create_full_invoice');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        
                if (err || !value) {
                console.log(err,"Error create_SO_invoice");
            } else {
                console.log("create_SO_invoice correcto");
                create_PO_invoice();
            }
            });

        }

        let confirm_PO = function () {
            
            let inParams = []
            inParams.push([PO_id])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('button_confirm');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {


                if (err || !value) {
                    console.log(err, "Error confirm_PO");

                } else {
                    console.log("confirm_PO correcto");
                    create_SO_invoice();
                }
            })
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error acceptProvider");

            } else {
                console.log(value);
                confirm_PO();
            }
        });
    }

     declineProvider(id: number) {

        let cancel_PO = function () {
            const id_po = id
            let inParams = []
            inParams.push([id_po])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('button_cancel');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err) {
                    console.log(err, "Error cancel_PO");

                } else {
                    console.log(value);
                }
            })
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {
            if (err || !value) {
                console.log(err, "Error declineProvider");

            } else {
                console.log(value);
                cancel_PO();
            }
        });
    } 
 
     requestTask(id: number) {

        let get_po_by_id = function () {
            const id_po = id
            let inParams = []
            inParams.push([['id', '=', id_po]])
            inParams.push(['partner_id', 'amount_total', 'user_id', 'origin', 'title',
                'note', 'commitment_date',])
            let params = []
            params.push(inParams)
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    console.log(err, "Error get_po_by_id");
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

         let get_desc_so = function (id) {
            let inParams = []
            inParams.push([['name', '=', id]])
            inParams.push(['note'])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    console.log(err, "Error get_desc_so");
                } else {
                    console.log(value);
                    task.description = value[0]['note'];
                    console.log(task);
                    task$.next(task);
                }
            })
        } 

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error requestTask");
            } else {
                console.log(value);
                get_po_by_id();
            }
        });
    } 


  


    getRequestedTask$(): Observable<TaskModel> {
        return task$.asObservable();
    }

    requestTaskListClient() {
        let get_so_list = function (partnerId) {
            let inParams = []
            inParams.push([['partner_id', '=', partnerId]])
            inParams.push(['partner_id', 'name', 'note', 'invoice_status', 'client_order_ref', 'title', 'require_materials',
                'commitment_date', 'address_street', 'address_floor', 'address_portal',
                'address_number', 'address_door', 'address_stairs', 'address_zip_code',
                'address_latitude', 'address_longitude'])


            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err) {
                    console.log(err || !value, "get_so_list");
                } else {
                    console.log(value);
                    tasksList = [];
                    for (let order of value) {
                        let temp = new TaskModel();
                        temp.description = order['note'];
                        temp.type = order['client_order_ref'];
                        temp.client_id = order['partner_id'][0];
                        temp.client_name = order['partner_id'][1];
                        temp.id_string = order['name'];
                        temp.id = order['id'];
                        temp.title = order['title'];
                        temp.require_materials = order['require_materials'];
                        temp.state = order['invoice_status'];
                        temp.date = String(order['commitment_date']).slice(0, 10);
                        temp.time = String(order['commitment_date']).slice(10, String(order['commitment_date']).length);
                        temp.address = new Address(order['address_street'],
                            order['address_number'],
                            order['address_portal'],
                            order['address_stairs'],
                            order['address_floor'],
                            order['address_door'],
                            order['address_zip_code'],
                            order['address_latitude'],
                            order['address_longitude'])
                        tasksList.push(temp);
                    }
                    tasksList$.next(tasksList);
                }
            })
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "requestTaskListClient");

            } else {
                get_so_list(user.partner_id);
            }
        });
    }

    requestTaskListProvider() {
        let get_po_list = function (partnerId) {
            let inParams = []
            inParams.push([['partner_id', '=', partnerId]])
            inParams.push(['user_id', 'partner_id', 'name', 'date_order', 'invoice_status'])

            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err || !value) {
                    console.log(err, "get_po_list");
                } else {
                    console.log(value);
                    tasksList = [];
                    for (let task of value) {
                        let temp = new TaskModel();
                        temp.client_id = task['user_id'][0];
                        temp.client_name = task['user_id'][1];
                        temp.provider_id = task['partner_id'][0];
                        temp.provider_name = task['partner_id'][1];
                        temp.id = task['id'];
                        temp.state = task['invoice_status'];
                        temp.id_string = task['name'];
                        temp.date_planned = task['date_order'];
                        tasksList.push(temp);
                    }
                    tasksList$.next(tasksList);
                }
            })
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "requestTaskListProvider");

            } else {
                get_po_list(user.partner_id);
            }
        });
    }

    getRequestedTaskList$(): Observable<TaskModel[]> {
        return tasksList$.asObservable();
    }

    requestOffersForTask(id) {

        let get_po_of_task = function () {

            console.log(id);
            let inParams = []
            inParams.push([['origin', 'ilike', id]])
            inParams.push(['partner_id', 'amount_total', 'user_id', 'origin','state'])


            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err || !value) {
                    console.log(err, "Error requestOffersForTask");
                } else {
                    console.log(value);
                    offersList = [];
                    for (let offer of value) {
                         if (offer['state'] === 'sent') {
                            let temp = new TaskModel();
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

                    }
                    offersList$.next(offersList);
                }
            })
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, 'get_po_of_task');

            } else {
                get_po_of_task();
            }
        });

    }

    getOffers$(): Observable<TaskModel[]> {
        return offersList$.asObservable();
    }

    sendOffer(offer: TaskModel) {
        let POline = {
            'name': 'Presupuesto',
            'product_id': 39,
            'product_uom': 1,
            'product_qty': 1,
            'price_unit': offer.budget,
            'date_planned': offer.date_planned,
            'order_id': offer.id,
        };
        let acept_PO = function() {
         
            let inParams = []
            let params = []
            inParams.push(offer.id)
            params.push(inParams)
            
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('set_state_sent');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        
                if (err) {
                console.log(err);
            } else {
                console.log(value);
            }
            });
         
        }
        let addLinePO = function () {

            console.log(POline);

            let inParams = []
            inParams.push(POline)
            let params = []
            params.push(inParams)
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order.line');//model
            fparams.push('create');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err || !value) {
                    console.log(err, "Error addLinePO");
                } else {
                    console.log(value);
                    acept_PO();
                }
            });
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {
            if (err || !value) {
                console.log(err, "Error sendOffer");
            } else {
                console.log(value);
                addLinePO()
            }
        });
    }

    setSelectedTab(tab: String) {
        this.selectedTab = tab;
        this.selectedTab$.next(this.selectedTab);
    }

    getSelectedTab$(): Observable<String> {
        return this.selectedTab$.asObservable();
    }


}