

export class ResultData{
    constructor(data, statusCode, errorMessage=null) {
        this.data = data;
        this.statusCode = statusCode;
        this.errorMessage = errorMessage;
    }
}