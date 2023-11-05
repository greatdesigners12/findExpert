export class Transaction {
    constructor(
        id,
        expert_id,
        customer_id,
        start_time,
        end_time,
        consultation_time,
        payment_amount,
        transaction_date,
        transaction_status,
        transaction_image,
        return_image
    ) {
        this.id = id;
        this.expert_id = expert_id;
        this.customer_id = customer_id;
        this.start_time = start_time;
        this.end_time = end_time;
        this.consultation_time = consultation_time;
        this.payment_amount = payment_amount;
        this.transaction_date = transaction_date;
        this.transaction_status = transaction_status;
        this.transaction_image = transaction_image;
        this.return_image = return_image;
    }

    serialize() {
        return {
            "id": this.id,
            "expert_id": this.expert_id,
            "customer_id": this.customer_id,
            "start_time": this.start_time,
            "end_time": this.end_time,
            "consultation_time": this.consultation_time,
            "payment_amount": this.payment_amount,
            "transaction_date": this.transaction_date,
            "transaction_status": this.transaction_status,
            "transaction_image": this.transaction_image,
            "return_image": this.return_image
        };
    }
}
