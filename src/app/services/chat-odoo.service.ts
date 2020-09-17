import { Injectable } from '@angular/core';
import * as odoo_xmlrpc from 'odoo-xmlrpc'
import {UsuarioModel} from '../models/usuario.model'

let odooClient = new odoo_xmlrpc({
    url: 'http://' + '192.168.1.15',
    port: 8069,
    db: 'demo',
    username: 'alan@example.com',
    password: 'alan',
});

let odooClient2 = new odoo_xmlrpc({
    url: 'http://' + '192.168.1.15',
    port: 8069,
    db: 'demo',
    username: 'gonzalez@example.com',
    password: 'gonzalez',
});

let messagesList:any;

@Injectable({
    providedIn: 'root'
  })
  export class ChatOdooService {

    
    user:UsuarioModel

    constructor(){}

    setUser(usuario:UsuarioModel){
        this.user=usuario;
        odooClient.username = "alan@example.com";
        odooClient.password = "alan";
    }

    sendMessageClient(message:string){

        let send_msg_PO = function() {
            const id_po = 84
            let inParams = []
            inParams.push([id_po])
            let params = []
            params.push(inParams)
            params.push({'body':message})
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

    sendMessageProvider(message:string){
        let send_msg_PO = function() {
            const id_po = 84
            let inParams = []
            inParams.push([id_po])
            //inParams.push([69])
            let params = []
            params.push(inParams)
            params.push({'body':message})
            odooClient2.execute_kw('purchase.order', 'message_post', params, function (err, value) {
                if (err) {
                    console.log(err);
                    
                } else {
                    console.log(value);
                    
                }
            })
        }
        
        odooClient2.connect(function (err,value) {
            if (err) { 
                console.log(err);
            } else {
                console.log(value);
                send_msg_PO() 
            }
        });
    }

    requestAllMessages(idPurchaseOrder:number){
        let list_msg_ids = function() {
            const id_po = idPurchaseOrder
            let inParams = []
            inParams.push([id_po])
            inParams.push([['res_id', '=', id_po]])
            inParams.push(['message_type','model','res_id','body','author_id'])
            let params = []
            params.push(inParams)
            odooClient.execute_kw('purchase.order', 'search_messages', params, function (err, value) {
                if (err) {
                    console.log(err);  
                } else {
                    console.log(value);
                    messagesList=value;
                    messagesList.reverse();
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

    getAllMessages():any{
        return messagesList;
    }
  }