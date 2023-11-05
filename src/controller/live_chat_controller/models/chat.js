import { Timestamp } from "firebase/firestore";

export class Chat {
    constructor(receiver_id, sender_id, sender_message, type = "text", transaction_id) {
        this.receiver_id = receiver_id;
        this.sender_id = sender_id;
        this.sender_message = sender_message;
        this.type = type;
        this.transaction_id = transaction_id;
        this.date = new Date()
    }

    serialize() {
        return {
            "receiver_id": this.receiver_id,
            "sender_id": this.sender_id,
            "sender_message": this.sender_message,
            "type": this.type,
            "transaction_id" : this.transaction_id,
            "date" : this.date
        };
    }
}