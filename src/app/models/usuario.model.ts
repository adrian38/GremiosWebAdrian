export class Address {
  street:string;
  number:string;
  portal:string;
  stair:string;
  floor:string;
  door:string;
  cp:string;
  latitude:string;
  longitude:string;

  constructor(street:string, number:string, portal:string, stair:string, floor:string,
              door:string, cp:string, latitude:string, longitude:string) {
      this.street=street;
      this.number=number;
      this.portal=portal;
      this.stair=stair;
      this.floor=floor;
      this.door=door;
      this.cp=cp;
      this.latitude = latitude;
      this.longitude = longitude;
  }
}

export class UsuarioModel{
    username:string;
    password:string;
    name:string;
    connection_id:number;
    partner_id:number
    type: string;
    connected:boolean;
    phone:number;
    id:number;
    realname:string;
    address:Address;

    constructor(){
      this.username = "";
      this.password = "";
      this.name = "";
      this.connection_id = 0;
      this.partner_id = 0;
      this.type  = "";
      this.connected = false;
      this.phone = 0;
      this.id = 0;
      this.realname  = "";
    }
}
