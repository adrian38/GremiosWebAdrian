import { Injectable, Testability } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model'
import { Address, TaskModel } from '../models/task.model'
import { empty, Observable, Subject } from 'rxjs';
import { AuthOdooService } from './auth-odoo.service';
import { HttpClient } from '@angular/common/http';
import { StringDecoder } from 'string_decoder';
let jayson = require('../../../node_modules/jayson/lib/client/');

let jaysonServer;


let task: TaskModel;
let task$ = new Subject<TaskModel[]>();

let tasksList: TaskModel[];
let tasksList$ = new Subject<TaskModel[]>();

let offersList: TaskModel[];
let offersList$ = new Subject<TaskModel[]>();

let notificationPoCancelled$ = new Subject<number[]>();  ////Proveedor

let notificationOffertCancelled$ = new Subject<number[]>(); //////cliente

let notificationSoCancelled$ = new Subject<number>(); ////// cliente 

//////////////////////////////////////////////////////////////////////////////

let notificationNewPoSuplier$ = new Subject<number[]>(); ///////Proveedor

let notificationNewSoClient$ = new Subject<boolean>(); ///////cliente

let notificationNewOffertSuplier$ = new Subject<number[]>(); ///////cliente

////////////////////////////////////////////////////////////////////////////

let notificationError$ = new Subject<boolean>();

let notificationOK$ = new Subject<boolean>();


let user: UsuarioModel;

@Injectable({
    providedIn: 'root'
})
export class TaskOdooService {

    selectedTab: String;
    selectedTab$ = new Subject<String>();

    constructor(private _authOdoo: AuthOdooService) {
        task = new TaskModel();

        jaysonServer = this._authOdoo.OdooInfoJayson;
    }

    
    createSOattachment(binarybuffer){

        let create_SO_attachment = function() {
        
            console.log(jaysonServer);
            console.log(binarybuffer);
            
            let attachement= {
            'name': 'test logo5.jpg',
            'datas': binarybuffer,
            'type': 'binary',
            'description': 'test logo5.jpg',
            'res_model': 'purchase.order',
            'res_id': 478,
        };
            let inParams = [];
            inParams.push(attachement);
            
            let params = [];
            params.push(inParams)
            
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('ir.attachment');//model
            fparams.push('create');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    console.log(err, "Error create_SO_attachment");

                } else {
                    console.log(err, "create_SO_attachment"); 
                }
            });
    }
    let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error conextion create_SO_attachment");
                //notificationError$.next(true);

            } else {
                create_SO_attachment();
            }
        });


    }
    
    
    setUser(usuario: UsuarioModel) {
        user = usuario;
    }

    getUser() {
        return user;
    }

    getNotificationError$(): Observable<boolean> {
        return notificationError$.asObservable();
    }

    notificationPull() {

        let id_po = [];
        let id_po_offert = [];
        let id_messg = [];
        let new_offert = [];

        let poll = function (uid, partner_id, last) {
            let path = '/longpolling/poll'

            client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + path });

            client.request('call', { context: { uid: uid }, channels: [jaysonServer.db + '_' + partner_id.toString()], last: last }, { context: { lang: 'es_ES', uid: uid } }, function (err, error, value) {
                if (err) {
                    console.log(err, "Error poll");
                } else {
                    console.log(value);
                    id_po = [];
                    id_messg = [];
                    id_po_offert = [];
                    new_offert = [];

                    if (typeof value !== 'undefined' && value.length > 0) {

                        console.log(value, "esta fue la notificacion q llego");

                        /*     setTimeout(() => {
                                 poll(user.id, user.partner_id, value[value.length - 1].id);
                             }, 55000); */
                        for (let task of value) {
                            if (task['message']['type'] === 'purchase_order_notification' && task['message']['action'] === 'created') {

                                console.log("se ha creado una nueva So");
                                id_po.push(task['message']['order_id'])
                            }

                            if (task['message']['type'] === 'purchase_order_notification' && task['message']['action'] === 'canceled' || task['message']['action'] === 'calceled' ) {

                                console.log("se ha eliminado una oferta");
                                id_po_offert.push(task['message']['order_id'])
                            }

                            if (task['message']['type'] === 'purchase_order_notification' && task['message']['action'] === 'accepted'  ) {

                                console.log("se ha creado una nueva oferta una oferta");
                                new_offert.push(task['message']['order_id']);
                            }

                            if (task['message']['type'] === 'message_notification') {

                                console.log("nuevo mensaje So");
                                id_messg.push(task['message']['message_id'])
                            }

                        }
                        if (typeof id_po !== 'undefined' && id_po.length > 0) {
                            // console.log(id_po,"lo q se esta mandando nueva solicitud")   
                            notificationNewPoSuplier$.next(id_po);
                        }

                        if (typeof id_po_offert !== 'undefined' && id_po_offert.length > 0) {
                            //console.log(id_po_offert,"lo q se esta mandando oferta eliminada")   
                            notificationOffertCancelled$.next(id_po_offert);
                        }

                        if (typeof new_offert !== 'undefined' && new_offert.length > 0) {
                            notificationNewOffertSuplier$.next(new_offert);
                        }

                        poll(user.id, user.partner_id, value[value.length - 1].id);

                    } else { poll(user.id, user.partner_id, 0); }


                }
            });
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error cancelPOsuplier");

            } else {
                poll(user.id, user.partner_id, 0);
            }
        });

    }

    getRequestedNotificationNewOffertSuplier$(): Observable<number[]> {
        return notificationNewOffertSuplier$.asObservable();
    }

    getRequestedNotificationOffertCancelled$(): Observable<number[]> {
        return notificationOffertCancelled$.asObservable();
    }

    getRequestedNotificationNewPoSuplier$(): Observable<number[]> {
        return notificationNewPoSuplier$.asObservable();
    }

    cancelPOsuplier(id: number) {

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

                    console.log(value);
                    notificationPoCancelled$.next([id]);


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

    getRequestedNotificationPoCancelled$(): Observable<number[]> {
        return notificationPoCancelled$.asObservable();
    }

    cancelSOclient(SO_id: number) {

        let cancelSOclientSelected = function () {

            let inParams = []
            inParams.push([SO_id])
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
                    console.log("Exito eliminando SO");

                    notificationSoCancelled$.next(SO_id);
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

    getNotificationSoCancelled$(): Observable<number> {
        return notificationSoCancelled$.asObservable();
    }

    newTask(task: TaskModel) {
    
       
        let createService = function () {

            console.log(task.time + ' ' + task.date);

            let SO = {
                'company_id': 1, 
                'order_line': [[0,0,{
                    'name': task.type, 
                    'price_unit': 0.0, 
                    'product_id': task.product_id, 
                    'product_uom': 1, 
                    'product_uom_qty': 1.0, 
                    'state': 'draft'
                }]],
                'partner_id': user.partner_id,
                'title':task.title,
                'require_materials':task.require_materials,
                'note':task.description,//descripcion del servicio
                //'commitment_date':task.time + ' ' + task.date,//fecha y hora del pedido
                'commitment_date':'2020-10-20 07:30:30',
                'require_payment': false, 
                'require_signature': false,
                'state': 'draft',
                'address_street' : task.address.street,
                'address_floor' : task.address.floor,
                'address_portal' : task.address.portal,
                'address_number' : task.address.number,
                'address_door' : task.address.door,
                'address_stairs' : task.address.stair,
                'address_zip_code' : task.address.cp,
                'address_latitude' : '40,47558',
                'address_longitude' : '-3,68992',
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
                    console.log(err, "Error createService");
                    notificationError$.next(true);

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
                            notificationError$.next(true);
                        } else {
                            console.log(value, "Confirmar Servicio Creado");
                            notificationNewSoClient$.next(true);

                        }
                    });
                }
            });
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error conextion newTask");
                notificationError$.next(true);

            } else {
                createService();
            }
        });

    }

    getNotificationNewSoClient$(): Observable<boolean> {
        return notificationNewSoClient$.asObservable();
    }

    
    editTask(desc: string) {

    }

    acceptProvider(PO_id: number, SO_id: number) {

        let tasksList = [];
        let SO_id_list = [];

        let get_so_type = function (So_id_list) {

            console.log(So_id_list);
            let inParams = [];
            inParams.push([['order_id', 'in', So_id_list]]);
            inParams.push(['product_id', 'order_id']);

            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order.line');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err) {
                    console.log(err || !value, "get_so_list");
                } else {
                    console.log(value);

                    for (let task of tasksList) {
                        let temp = (value.find(element => element.order_id[0] === task.id));
                        task.type = temp.product_id[1];
                    }

                    tasksList$.next(tasksList);

                }
            });

        }

        let get_so_list = function (partnerId) {
            let inParams = [];
            inParams.push([['partner_id', '=', partnerId]])
            inParams.push(['partner_id', 'date_order', 'name', 'note', 'invoice_status', 'client_order_ref', 'title', 'require_materials',
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

                    for (let order of value) {
                        let temp = new TaskModel();
                        SO_id_list.push(order['id']);
                        temp.description = order['note'];
                        temp.type = order['client_order_ref'];
                        temp.client_id = order['partner_id'][0];
                        temp.client_name = order['partner_id'][1];
                        temp.id_string = order['name'];
                        temp.id = order['id'];
                        temp.title = order['title'];
                        temp.require_materials = order['require_materials'];
                        temp.state = order['invoice_status'];
                        temp.date = order['date_order'];
                        temp.date_planned = String(order['commitment_date']).slice(0, 10);
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
                    if (SO_id_list.length) {
                        get_so_type(SO_id_list);
                    }
                }
            });
        }

        let create_PO_invoice = function () {

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
                    console.log(err, "Error create_PO_invoice");
                } else {
                    console.log("SO contratada");
                    get_so_list(user.partner_id);
                }
            });

        }

        let create_SO_invoice = function () {

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
                    console.log(err, "Error create_SO_invoice");
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


                if (err) {
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

    requestTaskPoUpdate(id_po: number[]) {


        let get_po_by_id = function () {

            //console.log(id_po);    
            let inParams = []
            inParams.push([['id', 'in', id_po]])
            inParams.push(['partner_id', 'amount_total', 'user_id', 'origin', 'title',
                'note', 'commitment_date', 'product_id', 'address_street', 'state', 'invoice_status', 'name', 'date_order'])
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

            client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    console.log(err, "Error get_po_by_id");
                } else {
                    tasksList = [];
                    for (let task of value) {
                        let temp = new TaskModel();
                        temp.offer_send = task['state'];
                        temp.budget = task['amount_total'];
                        temp.type = task['product_id'][1];
                        temp.description = task['note'];
                        temp.client_id = task['user_id'][0];
                        temp.client_name = task['user_id'][1];
                        temp.provider_id = task['partner_id'][0];
                        temp.provider_name = task['partner_id'][1];
                        temp.id = task['id'];
                        temp.state = task['invoice_status'];
                        temp.id_string = task['name'];
                        temp.date = task['date_order'];
                        temp.date_planned = String(task['commitment_date']).slice(0, 10);
                        temp.time = String(task['commitment_date']).slice(10, String(task['commitment_date']).length);
                        temp.title = task['title'];
                        temp.address = new Address(task['address_street'],
                            task['address_number'],
                            task['address_portal'],
                            task['address_stairs'],
                            task['address_floor'],
                            task['address_door'],
                            task['address_zip_code'],
                            task['address_latitude'],
                            task['address_longitude'])

                        tasksList.push(temp);
                    }
                    console.log(tasksList, "reques por notifications");
                    tasksList$.next(tasksList);
                }
            })
        }

        let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error  requestTaskPoUpdate");

            } else {
                get_po_by_id();
            }
        });

    }

    ///////////////////Para el chat //////aunque se puede cambiar
    requestTask(id: number) {

        let id_po = [];

        let get_po_by_id = function () {

            id_po.push(id);
            let inParams = []
            inParams.push([['id', 'in', id_po]])
            inParams.push(['partner_id', 'amount_total', 'user_id', 'origin', 'title',
                'note', 'commitment_date', 'product_id', 'address_street'])
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

                    id_po = [];
                    tasksList = [];
                    for (let task of value) {
                        let temp = new TaskModel();
                        //temp.offer_send = task['state'];
                        temp.budget = task['amount_total'];
                        temp.type = task['product_id'][1];
                        temp.description = task['note'];
                        temp.client_id = task['user_id'][0];
                        temp.client_name = task['user_id'][1];
                        temp.provider_id = task['partner_id'][0];
                        temp.provider_name = task['partner_id'][1];
                        temp.id = id;
                        //temp.state = task['invoice_status'];
                        //temp.id_string = task['name'];
                        //temp.date = task['date_order'];
                        temp.date_planned = String(task['commitment_date']).slice(0, 10);
                        //temp.time = String(task['commitment_date']).slice(10, String(task['commitment_date']).length);
                        temp.title = task['title'];
                        temp.address = new Address(task['address_street'],
                            task['address_number'],
                            task['address_portal'],
                            task['address_stairs'],
                            task['address_floor'],
                            task['address_door'],
                            task['address_zip_code'],
                            task['address_latitude'],
                            task['address_longitude'])

                        tasksList.push(temp);
                    }
                    console.log(tasksList);
                    task$.next(tasksList);
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

    getRequestedTask$(): Observable<TaskModel[]> {
        return task$.asObservable();
    }

    requestTaskListClient() {

        let tasksList = [];
        let SO_id = [];

        let get_so_type = function (So_id) {

            console.log(So_id);
            let inParams = [];
            inParams.push([['order_id', 'in', SO_id]]);
            inParams.push(['product_id', 'order_id']);

            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order.line');//model
            fparams.push('search_read');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
                if (err) {
                    console.log(err || !value, "get_so_list");
                } else {
                    console.log(value);

                    for (let task of tasksList) {
                        let temp = (value.find(element => element.order_id[0] === task.id));
                        task.type = temp.product_id[1];
                    }

                    tasksList$.next(tasksList);

                }
            });

        }

        let get_so_list = function (partnerId) {
            let inParams = [];
            inParams.push([['partner_id', '=', partnerId]])
            inParams.push(['partner_id', 'date_order', 'name', 'note', 'invoice_status', 'client_order_ref', 'title', 'require_materials',
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

                    for (let order of value) {
                        let temp = new TaskModel();
                        SO_id.push(order['id']);
                        temp.description = order['note'];
                        temp.type = order['client_order_ref'];
                        temp.client_id = order['partner_id'][0];
                        temp.client_name = order['partner_id'][1];
                        temp.id_string = order['name'];
                        temp.id = order['id'];
                        temp.title = order['title'];
                        temp.require_materials = order['require_materials'];
                        temp.state = order['invoice_status'];
                        temp.date = order['date_order'];
                        temp.date_planned = String(order['commitment_date']).slice(0, 10);
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
                    if (SO_id.length) {
                        get_so_type(SO_id);
                    }
                }
            });
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
            inParams.push(['state', 'product_id', 'note', 'user_id', 'partner_id', 'name', 'date_order', 'commitment_date', 'invoice_status', 'title', 'note', 'require_materials',
                'commitment_date', 'address_street', 'address_floor', 'address_portal',
                'address_number', 'address_door', 'address_stairs', 'address_zip_code',
                'address_latitude', 'address_longitude'])
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
                        temp.offer_send = task['state'];
                        temp.type = task['product_id'][1];
                        temp.description = task['note'];
                        temp.client_id = task['user_id'][0];
                        temp.client_name = task['user_id'][1];
                        temp.provider_id = task['partner_id'][0];
                        temp.provider_name = task['partner_id'][1];
                        temp.id = task['id'];
                        temp.state = task['invoice_status'];
                        temp.id_string = task['name'];
                        temp.date = task['date_order'];
                        temp.date_planned = String(task['commitment_date']).slice(0, 10);
                        temp.time = String(task['commitment_date']).slice(10, String(task['commitment_date']).length);
                        temp.title = task['title'];
                        temp.address = new Address(task['address_street'],
                            task['address_number'],
                            task['address_portal'],
                            task['address_stairs'],
                            task['address_floor'],
                            task['address_door'],
                            task['address_zip_code'],
                            task['address_latitude'],
                            task['address_longitude'])

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
            inParams.push(['partner_id', 'amount_total', 'user_id', 'origin', 'state'])


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
        let acept_PO = function () {

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