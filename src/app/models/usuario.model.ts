
export class UsuarioModel{
    username:string;
    password:string;
    name:string;
    connection_id:number;
    partner_id:number
    type: string;
    connected:boolean;
    phone:number;
    address:string;
    id:number;
    realname:string;

    constructor(){
      this.username = "";
      this.password = "";
      this.name = "";
      this.connection_id = 0;
      this.partner_id = 0;
      this.type  = "";
      this.connected = false;
      this.phone = 0;
      this.address  = "";
      this.id = 0;
      this.realname  = "";
    }
}
