import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import { MessageModel } from '../models/message.model';
import {UsuarioModel} from '../models/usuario.model'
import {Observable, Subject} from 'rxjs';
import { AuthOdooService } from '../services/auth-odoo.service';

let odooClient;
let user: UsuarioModel

let messagesList:MessageModel[];
let messagesList$ = new Subject<MessageModel[]>();

@Injectable({
    providedIn: 'root'
  })
  export class ChatOdooService {


  //  user:UsuarioModel
    id:any;

    constructor(private _authOdoo:AuthOdooService){}

    setUser(usuario:UsuarioModel){
        user=usuario;
        odooClient = this._authOdoo.OdooInfo;
    }

    sendMessageClient(message:MessageModel){

        let send_msg_PO = function() {
            let inParams = []
            inParams.push([message.offer_id])
            let params = []
            params.push(inParams)
            params.push({'body':message.message,'message_type':'notification', 'subtype':'false'})
            odooClient.execute_kw('purchase.order', 'message_post', params, function (err, value) {
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
                send_msg_PO(); 
            }
        });

    }

    requestAllMessages(idPurchaseOrder:number){
        let list_msg_ids = function() {
            const id_po = idPurchaseOrder
            let inParams = []
            inParams.push([id_po])
            inParams.push([['res_id', '=', id_po]])
            inParams.push(['message_type','model','res_id','body','author_id','author_avatar','display_name','subtype_id'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'search_messages', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    //console.log(value);
                    value = value.filter(messages=>{
                        return messages.subtype_id === false;
                    });
                    value.reverse();
                    messagesList = [];
                    for (let message of value){

                        let temp: MessageModel= new MessageModel(message['body'].slice(3,message['body'].length-4),
                                                                 message['author_id'][1],
                                                                 message['author_id'][0], message['res_id']);
                        messagesList.push(temp);
                    }
                    messagesList$.next(messagesList);
                    //console.log(messagesList);                                    
                }
            })
        }
          
        odooClient.connect(function (err,value) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(value);
                list_msg_ids() 
            }
        });
    }

    getAllMessages$(): Observable<MessageModel[]>{
        return messagesList$.asObservable();
    }
  }