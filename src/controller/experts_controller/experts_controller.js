import { db } from "../firebaseApp";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Expert } from "./models/expert";
import { ResultData } from "../structureJson/resultData";

export class ExpertsController {
    async getExpertById(id) {
        const result = new ResultData();
    
        try {
            const docRef = doc(db, "expertData", id);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                result.data = docSnap.data();
                result.errorMessage = "";
                result.statusCode = 200;
                console.log("Document data:", docSnap.data());
            } else {
                result.data = null;
                result.errorMessage = "Expert not found";
                result.statusCode = 404;
                console.log("No such document!");
            }
    
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to get expert: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    
    async updateExpert(id, newData) {
        const result = new ResultData();

        try {
            const expertsCollection = collection(db, "expertData");
            const expertRef = doc(expertsCollection, id);

            await updateDoc(expertRef, newData);

            result.data = newData;
            result.errorMessage = "";
            result.statusCode = 200;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to update expert: " + error.message;
            result.statusCode = 500;
        }

        return result;
    }

    async getAllVerifiedExperts() {
        const result = new ResultData();

        try {
            const expertsCollection = collection(db, "expertData");
            const verifiedExpertsQuery = query(expertsCollection, where("verified", "==", "true"));
            const expertSnapshot = await getDocs(verifiedExpertsQuery);

            const experts = [];
            expertSnapshot.forEach((expertDoc) => {
                const expertData = expertDoc.data();
                experts.push(
                    new Expert(
                        expertData.fullName,
                        expertData.phoneNumber,
                        expertData.email,
                        expertData.password,
                        expertData.birthDate,
                        expertData.gender,
                        expertData.education,
                        expertData.fieldId,
                        expertData.nik,
                        expertData.jobExperience,
                        expertData.ktp,
                        expertData.certificates,
                        expertData.profilePicture,
                        expertData.verified,
                        expertData.status,
                        expertData.cash_amount
                    )
                );
            });

            result.data = experts;
            result.errorMessage = "";
            result.statusCode = 200;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to get verified experts: " + error.message;
            result.statusCode = 500;
        }

        return result;
    }

    async getExpertCashAmountById(expertId) {
        const result = new ResultData();
    
        try {
            const expertsCollection = collection(db, "expertData");
            const expertRef = doc(expertsCollection, expertId);
            const expertSnapshot = await getDoc(expertRef);
            const expertData = expertSnapshot.data();
    
            if (expertData) {
                result.data = expertData.cash_amount;
                result.errorMessage = "";
                result.statusCode = 200;
            } else {
                result.data = null;
                result.errorMessage = "Expert not found.";
                result.statusCode = 404;
            }
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to get expert's cash amount: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    

    async deleteExpert(id) {
        const result = new ResultData();

        try {
            const expertsCollection = collection(db, "expertData");
            const expertRef = doc(expertsCollection, id);

            await deleteDoc(expertRef);

            result.data = null;
            result.errorMessage = "";
            result.statusCode = 200;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to delete expert: " + error.message;
            result.statusCode = 500;
        }

        return result;
    }
}
