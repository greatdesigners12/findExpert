export class Expert {
    constructor(fullName, phoneNumber, email, password, birthDate, gender, education, fieldId, nik, jobExperience, ktp, certificates, profilePicture, cash_amount, price, id="") {
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
        this.verified = "false";
        this.status = "offline";
        this.cash_amount = 0;
        this.price = price;
        this.id = id;
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
            "id": this.id
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
