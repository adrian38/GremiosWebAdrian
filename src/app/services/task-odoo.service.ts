import { Injectable, Testability } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model'
import { Address, TaskModel } from '../models/task.model'
import { empty, Observable, Subject } from 'rxjs';
import { AuthOdooService } from './auth-odoo.service';
import { HttpClient } from '@angular/common/http';
import { StringDecoder } from 'string_decoder';
let jayson = require('../../../node_modules/jayson/lib/client/');

let jaysonServer;

let taskCesar: TaskModel;

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

let notificationNewOffertSuplier$ = new Subject<any[]>(); ///////cliente

////////////////////////////////////////////////////////////////////////////

let notificationNewMessg$ = new Subject<number[]>(); ///////Proveedor

let notificationSendOffertOk$ = new Subject<number>();

let notificationError$ = new Subject<boolean>();

let notificationOK$ = new Subject<boolean>();

let notificationPoAcepted$ = new Subject<any[]>();
//Old
//let urlImage = 'data:type/example;base64,';
//New
let urlImage = 'data:image/jpeg;base64,'

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

  setUser(usuario: UsuarioModel) {
    user = usuario;
  }

  setTaskCesar(task: TaskModel) {
    taskCesar = task;
  }
  getTaskCesar() {
    return taskCesar;
  }

  getUser() {
    return user;
  }

  getNotificationError$(): Observable<boolean> {
    return notificationError$.asObservable();
  }

  getRequestedNotificationPoAcepted$(): Observable<any[]> {
    return notificationPoAcepted$.asObservable();
  }

  getRequestedNotificationNewMessg$(): Observable<number[]> {
    return notificationNewMessg$.asObservable();
  }

  createSOattachment(binarybuffer) {

    let create_SO_attachment = function () {

      console.log(jaysonServer);
      console.log(binarybuffer);

      let attachement = {
        'name': 'test logo6.jpg',
        'datas': binarybuffer,
        'type': 'binary',
        'description': 'test logo6.jpg',
        'res_model': 'purchase.order',
        'res_id': 146,
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
          console.log(value, "create_SO_attachment");
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

  notificationPull() {

    let id_po = [];
    let id_po_offert = [];
    let id_messg = [];
    let new_offert = [];
    let id_offert_acepted = [];

    let poll = function (uid, partner_id, last) {
      let path = '/longpolling/poll'

      client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + path });

      client.request('call', { context: { uid: uid }, channels: [jaysonServer.db + '_' + partner_id.toString()], last: last }, { context: { lang: 'es_ES', uid: uid } }, function (err, error, value) {
        if (err) {
          console.log(err, "Error poll");
        } else {
          //console.log(value,"Notificaciones");
          id_po = [];
          id_messg = [];
          new_offert = [];

          if (typeof value !== 'undefined' && value.length > 0) {

            console.log(value, "esta fue la notificacion q llego");

            for (let task of value) {
              if (task['message']['type'] === 'purchase_order_notification' && task['message']['action'] === 'created') {

                console.log("se ha creado una nueva So");
                id_po.push(task['message']['order_id'])
              }

              if (task['message']['type'] === 'purchase_order_notification' && task['message']['action'] === 'canceled' || task['message']['action'] === 'calceled') {

                console.log("se ha eliminado una oferta");
                id_po_offert.push(task['message']['order_id'])
              }

              if (task['message']['type'] === 'purchase_order_notification' && task['message']['action'] === 'confirmed') {

                console.log("se ha contratado Servicio");
                id_offert_acepted.push({ po_id: task['message']['order_id'], so_origin: task['message']['origin'] });

              }

              if (task['message']['type'] === 'purchase_order_notification' && task['message']['action'] === 'accepted') {

                console.log("se ha creado una nueva oferta una oferta");
                new_offert.push({ order_id: task['message']['order_id'], origin: task['message']['origin'] });
              }

              if (task['message']['type'] === 'message_notification' && task['message']['action'] === 'new') {

                console.log("nuevo mensaje So");
                id_messg.push(task['message']['message_id'])
              }

            }

            if (typeof id_messg !== 'undefined' && id_messg.length > 0) {
              // console.log(id_messg,"nuevo mensaje id")
              notificationNewMessg$.next(id_messg);

            }


            if (typeof id_po !== 'undefined' && id_po.length > 0) {
              console.log(id_po, "lo q se esta mandando nueva solicitud")
              notificationNewPoSuplier$.next(id_po);
            }

            if (typeof id_offert_acepted !== 'undefined' && id_offert_acepted.length > 0) {
              // console.log(id_offert_acepted,"lo q se esta mandando oferta aceptada")
              notificationPoAcepted$.next(id_offert_acepted);
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

  getRequestedNotificationNewOffertSuplier$(): Observable<any[]> {
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

  //////// De la forma de Michel
  newTask(task: TaskModel) {

    let count: number;


    let confirmService = function (SO_id: number) {
      let inParams = []
      inParams.push(SO_id)
      let params = []
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

    let create_SO_attachment = function (SO_id: number) {

      console.log(count);

      let attachement = {
        'name': 'photoSolicitud_' + count + '.jpg',
        'datas': task.photoNewTaskArray[count],
        'type': 'binary',
        'description': 'photoSolicitud_' + count.toString + '.jpg',
        'res_model': 'sale.order',
        'res_id': SO_id,
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
          console.log(value, "create_SO_attachment");
          count--;
          if (count >= 0) {
            create_SO_attachment(SO_id);
          } else {

            console.log(count, "confirmar so")
            confirmService(SO_id);
          }
        }
      });
    }

    let createService = function () {
      count = 0;

      let SO = {
        'company_id': 1,
        'order_line': [[0, 0, {
          'name': task.type,
          'price_unit': 0.0,
          'product_id': task.product_id,
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

          console.log(err, " Error createService");

        } else {
          console.log(value, "createService");

          if (task.photoNewTaskArray.length) {
            count = task.photoNewTaskArray.length - 1;
            create_SO_attachment(value);

          } else {
            confirmService(value);
          }

        }
      });
    }

    let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
    client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

      if (err || !value) {
        notificationError$.next(true);
        console.log(err, "newTask");

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
          //      console.log(tasksList, "reques por notifications");
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

    let get_photo_so = function () {

      let inParams = [];
      inParams.push([['res_id', 'in', SO_id]]);
      inParams.push(['name', 'res_id', 'res_model', 'url', 'datas', 'mimetype', 'file_size']);

      let params = []
      params.push(inParams)

      let fparams = [];
      fparams.push(jaysonServer.db);
      fparams.push(user.id);
      fparams.push(jaysonServer.password);
      fparams.push('ir.attachment');//model
      fparams.push('search_read');//method

      for (let i = 0; i < params.length; i++) {
        fparams.push(params[i]);
      }
      client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

        if (err) {
          console.log(err, "Error get_photo_so");
        } else {
          let img = new Image;
          for (let resId of value) {
            for (let task of tasksList) {
              if (task.id === resId.res_id) {
                //img.src = 'data:image/png;base64,' + resId.datas;
                resId.datas = "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"
                task.photoNewTaskArray.push(urlImage + resId.datas);
                console.log(task.photoNewTaskArray)
              }
            }

          }

          tasksList$.next(tasksList);
        }

      });

    }

    let get_so_type = function () {

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
        if (err || !value) {
          console.log(err, "Error get_so_list");
        } else {
          // console.log(value);

          for (let task of tasksList) {
            let temp = (value.find(element => element.order_id[0] === task.id));
            task.type = temp.product_id[1];
          }
          get_photo_so();

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

          SO_id = [];
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
            temp.time = String(order['commitment_date']);
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

            get_so_type();
          } else {

            tasksList$.next(tasksList);
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

    let SO_origin = [];
    let SO_id = [];

    let get_photo_so = function () {

      let inParams = [];
      inParams.push([['res_id', 'in', SO_id]]);
      inParams.push(['name', 'res_id', 'res_model', 'url', 'datas', 'mimetype', 'file_size']);

      let params = []
      params.push(inParams)

      let fparams = [];
      fparams.push(jaysonServer.db);
      fparams.push(user.id);
      fparams.push(jaysonServer.password);
      fparams.push('ir.attachment');//model
      fparams.push('search_read');//method

      for (let i = 0; i < params.length; i++) {
        fparams.push(params[i]);
      }
      client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        if (err) {
          console.log(err, "Error get_photo_so");
        } else {

          console.log(value);
          if (value) {
            for (let resId of value) {
              for (let task of tasksList) {
                if (task.origin_id === resId.res_id) {
                  task.photoNewTaskArray.push(resId.datas);
                }
              }

            }
          }
          console.log("actualizando tareas")
          tasksList$.next(tasksList);
        }

      });

    }


    let get_Res_Id = function () {


      let inParams = [];
      inParams.push([['name', 'in', SO_origin]]);
      inParams.push(['id', 'name']);

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
          console.log(err, "Error get_Res_Id");
        } else {
          SO_id = [];
          for (let id_value of value) {
            SO_id.push(id_value.id);
          }
          for (let task of tasksList) {
            let temp = (value.find(element => element.name === task.origin));
            if (temp) {
              task.origin_id = temp.id;
            }
          }

          get_photo_so();
        }
      });

    }


    let get_po_list = function (partnerId) {
      let inParams = []
      inParams.push([['partner_id', '=', partnerId]])
      inParams.push(['state', 'product_id', 'note', 'user_id', 'partner_id', 'name', 'date_order', 'commitment_date', 'invoice_status', 'title', 'note', 'require_materials',
        'commitment_date', 'address_street', 'address_floor', 'address_portal',
        'address_number', 'address_door', 'address_stairs', 'address_zip_code',
        'address_latitude', 'address_longitude', 'origin', 'state'])
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

          tasksList = [];
          SO_origin = [];
          for (let task of value) {
            let temp = new TaskModel();
            temp.offer_send = task['state'];
            temp.origin = task['origin'];
            SO_origin.push(task['origin']);
            temp.type = task['product_id'][1];
            temp.description = task['note'];
            temp.client_id = task['user_id'][0];
            temp.client_name = task['user_id'][1];
            temp.provider_id = task['partner_id'][0];
            temp.provider_name = task['partner_id'][1];
            temp.require_materials = task['require_materials'];
            temp.id = task['id'];
            temp.state = task['invoice_status'];
            temp.id_string = task['name'];
            temp.date = task['date_order'];
            temp.date_planned = String(task['commitment_date']).slice(0, 10);
            temp.time = String(task['commitment_date']);
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

          if (SO_origin.length) {

            get_Res_Id();

          } else {
            tasksList$.next(tasksList);
          }


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
          if (typeof offersList !== 'undefined' && offersList.length > 0) {
            //console.log(id_po_offert,"lo q se esta mandando oferta eliminada")
            offersList$.next(offersList);
          } else {
            let temp = new TaskModel();
            temp.origin = id;
            temp.budget = 0;
            offersList[0] = temp;
            offersList$.next(offersList);
          }

        }
      })
    }

    let client = jayson.http({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
    client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

      if (err || !value) {
        console.log(err, 'Error get_po_of_task');

      } else {
        get_po_of_task();
      }
    });

  }

  getOffers$(): Observable<TaskModel[]> {
    return offersList$.asObservable();
  }

  getnotificationSendOffertOk$(): Observable<number> {
    return notificationSendOffertOk$.asObservable();
  }

  sendOffer(offer: TaskModel) {
    let POline = {
      'name': 'Presupuesto',
      'product_id': 16,
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
          notificationSendOffertOk$.next(offer.id);
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
