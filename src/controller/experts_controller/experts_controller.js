import { db } from "../firebaseApp";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Expert } from "./models/expert";
import { ResultData } from "../structureJson/resultData";

export class ExpertsController {
    async getExpertById(id) {
        const result = new ResultData();

        try {
            const expertsCollection = collection(db, "expertData"); 
            const expertSnapshot = await getDocs(expertsCollection);

            for (const expertDoc of expertSnapshot.docs) {
                const expertData = expertDoc.data();
                if (expertData.id === id) {
                    result.data = new Expert(
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
                        expertData.status
                    );
                    result.errorMessage = "";
                    result.statusCode = 200;
                    return result;
                }
            }

            result.data = null;
            result.errorMessage = "Expert not found";
            result.statusCode = 404;
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
