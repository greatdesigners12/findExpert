export class Expert {
    constructor(fullName, phoneNumber, email, password, birthDate, gender, education, fieldId, nik, jobExperience, ktp, certificates, profilePicture, open, close) {
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
        this.status = "unverified";
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
            "status": this.status,
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
            this.open === "" || // New variable
            this.close === "" // New variable
        );
    }
}
