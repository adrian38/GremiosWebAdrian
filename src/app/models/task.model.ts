import {UsuarioModel} from './usuario.model'

export class TaskModel{
    id:number;
    client:UsuarioModel;
    provider:UsuarioModel;
    name:string;
    desc:string;
    img:string;
    type:string;
    finished:boolean;

    constructor(name?:string, desc:string="", img:string="", type:string="",
                finished:boolean=false){

        this.id=0;
        this.name=name;
        this.desc=desc;
        this.img=img;
        this.type = type;
        this.finished =finished;

    }
}