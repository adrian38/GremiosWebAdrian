export class MessageModel{
    message:string;
    author:string;

    constructor(message:string ='', author:string=''){

        this.message = message;
        this.author = author;
    }
}