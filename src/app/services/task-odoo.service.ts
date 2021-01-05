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

let knownTypes = {
  '/': 'data:image/jpg;base64,',
  'i': 'data:image/png;base64,',

}
/* let urlImagePng = 'data:type/example;base64,';
let urlImage = 'data:image/jpeg;base64,' */

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
        'address_latitude': task.address.latitude,
        'address_longitude': task.address.longitude,
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

          for (let resId of value) {
            for (let task of tasksList) {
              if (task.id === resId.res_id) {

                if (knownTypes[resId.datas[0]]) {
                  task.photoNewTaskArray.push(knownTypes[resId.datas[0]] + resId.datas);
                }

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

                  if (knownTypes[resId.datas[0]]) {
                    task.photoNewTaskArray.push(knownTypes[resId.datas[0]] + resId.datas);
                  }
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

    let partner_id = [];

    let search_comment_provider = function () {

      let inParams = []
      inParams.push([['id', 'in', partner_id]])
      inParams.push([
        'id',
        'comment',
      ])
      let params = []
      params.push(inParams)

      let fparams = [];
      fparams.push(jaysonServer.db);
      fparams.push(user.id);
      fparams.push(jaysonServer.password);
      fparams.push('res.partner');//model
      fparams.push('search_read');//method

      for (let i = 0; i < params.length; i++) {
        fparams.push(params[i]);
      }

      client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        if (err) {
          console.log(err, "Error search_comment_provider")
        } else {

          for (let resId of value) {
            for (let offer of offersList) {
              if (offer.provider_id === resId.id) {

                offer.comment = resId.comment;

              }
            }

          }
          console.log(offersList)
          offersList$.next(offersList);

        }
      });
    }

    let search_avatar_provider = function () {

      console.log(partner_id, "partner_id provider")
      let inParams = []
      inParams.push([['partner_id', 'in', partner_id]])
      inParams.push([
        'partner_id',
        'image_1920'
      ])
      let params = []
      params.push(inParams)

      let fparams = [];
      fparams.push(jaysonServer.db);
      fparams.push(user.id);
      fparams.push(jaysonServer.password);
      fparams.push('res.users');//model
      fparams.push('search_read');//method

      for (let i = 0; i < params.length; i++) {
        fparams.push(params[i]);
      }

      client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {
        if (err) {
          console.log(err, "Error search_avatar_provider");
        } else {

          for (let resId of value) {
            for (let offer of offersList) {
              if (offer.provider_id === resId.partner_id[0]) {

                if (knownTypes[resId.image_1920[0]]) {
                  offer.photoProvider = (knownTypes[resId.image_1920[0]] + resId.image_1920);
                }

              }
            }

          }
          search_comment_provider();
        }
      })
    }

    let get_po_of_task = function () {

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
          partner_id = [];
          offersList = [];
          for (let offer of value) {
            if (offer['state'] === 'sent') {
              let temp = new TaskModel();
              temp.client_id = offer['user_id'][0];
              temp.client_name = offer['user_id'][1];
              temp.provider_id = offer['partner_id'][0];
              partner_id.push(offer['partner_id'][0]);
              temp.provider_name = offer['partner_id'][1];
              temp.id = offer['id'];
              temp.id_string = offer['name'];
              temp.budget = offer['amount_total'];
              temp.origin = offer['origin'];
              offersList.push(temp);
            }

          }
          if (typeof offersList !== 'undefined' && offersList.length > 0) {
            //offersList$.next(offersList);
            search_avatar_provider();
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
