export class Cash {
    constructor(account, amount, expert_id, id, image, no_rek, status, withdraw_time) {
        this.account = account;
        this.amount = amount;
        this.expert_id = expert_id;
        this.id = id;
        this.image = image;
        this.no_rek = no_rek;
        this.status = status;
        this.withdraw_time = withdraw_time;

    }

    serialize() {
        return {
            "account": this.account,
            "amount": this.amount,
            "expert_id": this.expert_id,
            "id": this.id,
            "image": this.image,
            "no_rek": this.no_rek,
            "status": this.status,
            "withdraw_time": this.withdraw_time,

        };
    }
}
