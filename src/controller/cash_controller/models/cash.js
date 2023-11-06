export class Cash {
    constructor(amount, id, expert_id, image, no_rek, status, withdraw_time) {
        this.amount = amount;
        this.id = id;
        this.expert_id = expert_id;
        this.image = image;
        this.no_rek = no_rek;
        this.status = status;
        this.withdraw_time = withdraw_time;
    }

    serialize() {
        return {
            "amount": this.amount,
            "id": this.id,
            "expert_id": this.expert_id,
            "image": this.image,
            "no_rek": this.no_rek,
            "status": this.status,
            "withdraw_time": this.withdraw_time
        };
    }
}
