export class Expert {
    constructor(fullName, phoneNumber, email, password, birthDate, gender, education, fieldId, nik, jobExperience, ktp, certificates, profilePicture, verified, status, cash_amount, price, id, date) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
        this.gender = gender;
        this.education = education;
        this.fieldId = fieldId;
        this.nik = nik;
        this.jobExperience = jobExperience;
        this.ktp = ktp;
        this.certificates = certificates;
        this.profilePicture = profilePicture;
        this.verified = verified;
        this.status = status;
        this.cash_amount = cash_amount;
        this.price = price;
        this.id = id;
        this.registered_date = date
    }

    serialize() {
        return {
            "fullName": this.fullName,
            "phoneNumber": this.phoneNumber,
            "email": this.email,
            "password": this.password,
            "birthDate": this.birthDate,
            "gender": this.gender,
            "education": this.education,
            "fieldId": this.fieldId,
            "nik": this.nik,
            "jobExperience": this.jobExperience,
            "ktp": this.ktp,
            "certificates": this.certificates,
            "profilePicture": this.profilePicture,
            "verified": this.verified,
            "status": this.status,
            "cash_amount": this.cash_amount,
            "price": this.price,
            "id": this.id,
            "registered_date" : this.registered_date
        };
    }

    checkIfThereIsEmpty() {
        return (
            this.fullName === "" ||
            this.phoneNumber === "" ||
            this.email === "" ||
            this.password === "" ||
            this.birthDate === "" ||
            this.gender === "" ||
            this.education === "" ||
            this.fieldId === "" ||
            this.nik === "" ||
            this.jobExperience === "" ||
            this.ktp === "" ||
            this.certificates === null ||
            this.profilePicture === "" ||
            this.verified === "" ||
            this.status === "" ||
            this.cash_amount === "" ||
            this.price === ""
        );
    }
}
