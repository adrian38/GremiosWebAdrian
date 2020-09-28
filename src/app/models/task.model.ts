
export class TaskModel{
    type:string;
    description:string;
    id:number;
    id_string:string;
    client_id:number;
    client_name:string;
    provider_id:number;
    provider_name:number;
    budget:number;
    origin:string;
    date_planned:string;

    constructor(type:string="",description:string="", id:number=0, id_string:string="",
                client_id:number=0,client_name:string="", provider_id:number=0, provider_name:number=0,
                budget:number=0,origin:string="",date_planned:string=""){

        this.type=type;
        this.description=description;
        this.id=id;
        this.id_string=id_string;
        this.client_id=client_id;
        this.client_name=client_name;
        this.provider_id=provider_id;
        this.provider_name=provider_name;
        this.budget=budget;
        this.origin=origin;
        this.date_planned=date_planned;
    }
}