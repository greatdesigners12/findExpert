
export class UserData{
    constructor(id, fullName, job){
        this.id = id 
        this.fullName = fullName
        this.job = job
    }

    serialize(){
        return {"id" : this.id, "fullName" : this.fullName, "job" : this.job}
    }
}