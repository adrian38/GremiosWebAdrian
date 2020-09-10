
export class UsuarioModel{
    username:string;
    password:string;
    address:string;
    name:string;
    phone:number;
    type: number;
    active:boolean;
    id:number;

    constructor(user:string="", pass:string="", address:string="",
                name:string="", phone:number=0, type:number=0,
                active:boolean = false, id:number=0){
        
        this.username = user;
        this.password = pass;
        this.address = address;
        this.name = name;
        this.id = id;
        this.type = type;
        this.active = active;
    }
}