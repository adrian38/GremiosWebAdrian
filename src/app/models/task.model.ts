import { HexBase64BinaryEncoding } from "crypto";

export class Address {
    street: string;
    number: string;
    portal: string;
    stair: string;
    floor: string;
    door: string;
    cp: string;
    latitude: string;
    longitude: string;

    constructor(street: '', number: '', portal: '', stair: '', floor: '',
        door: '', cp: '', latitude: '', longitude: '') {
        this.street = street;
        this.number = number;
        this.portal = portal;
        this.stair = stair;
        this.floor = floor;
        this.door = door;
        this.cp = cp;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}


export class TaskModel {
    type: string;
    description: string;
    id: number;
    id_string: string;
    client_id: number;
    client_name: string;
    provider_id: number;
    provider_name: number;
    budget: number;
    origin: string;
    date_planned: string;
    date: string;
    time: string;
    title: string;
    address: Address
    require_materials: boolean;
    state: String;
    offer_send: String;
    product_id: number;
    photoNewTaskArray: Array<any>;
    origin_id: number;
    photoProvider: any;
    comment: string;
    ranking: number;

    constructor(product_id: number = 0, offer_send: string = "", type: string = "", description: string = "", id: number = 0, id_string: string = "",
        client_id: number = 0, client_name: string = "", provider_id: number = 0, provider_name: number = 0,
        budget: number = 0, origin: string = "", date_planned: string = "", date: string = "",
        time: string = "", title: string = "", require_materials: boolean = true, origin_id = 0, photoProvider = "", comment = "", ranking = 0) {

        this.comment = comment;
        this.ranking = ranking;
        this.photoProvider = photoProvider;
        this.origin_id = origin_id;
        this.photoNewTaskArray = [];
        this.product_id = product_id;
        this.offer_send = offer_send;
        this.type = type;
        this.description = description;
        this.id = id;
        this.id_string = id_string;
        this.client_id = client_id;
        this.client_name = client_name;
        this.provider_id = provider_id;
        this.provider_name = provider_name;
        this.budget = budget;
        this.origin = origin;
        this.date_planned = date_planned;
        this.date = date;
        this.time = time;
        this.title = title;
        this.require_materials = require_materials;
    }
}