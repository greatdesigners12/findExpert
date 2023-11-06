import { db } from "../firebaseApp";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, getDoc, where } from "firebase/firestore";
import { Expert } from "./models/expert";
import { ResultData } from "../structureJson/resultData";

export class ExpertsController {
    async getExpertById(id) {
        const result = new ResultData();

        try {
            // const expertsCollection = collection(db, "expertData"); 
            // const expertSnapshot = await getDocs(expertsCollection);
            const docRef = doc(db, "expertData", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                result.data = docSnap.data();
                const docRefField = doc(db, "field", result.data.fieldId);
                const docSnapField = await getDoc(docRefField);
                result.data["field"] = docSnapField.data()
                result.errorMessage = "";
                result.statusCode = 200;
            console.log("Document data:", docSnap.data());
            } else {
                result.data = null;
                result.errorMessage = "There's an error in getexpert(id)";
                result.statusCode = 400;
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            }
            return result
            // for (const expertDoc of expertSnapshot.docs) {
            //     const expertData = expertDoc.data();
            //     if (expertData.id === id) {
            //         result.data = new Expert(
            //             expertData.fullName,
            //             expertData.phoneNumber,
            //             expertData.email,
            //             expertData.password,
            //             expertData.birthDate,
            //             expertData.gender,
            //             expertData.education,
            //             expertData.fieldId,
            //             expertData.nik,
            //             expertData.jobExperience,
            //             expertData.ktp,
            //             expertData.certificates,
            //             expertData.profilePicture,
            //             expertData.verified,
            //             expertData.status
            //         );
            //         result.errorMessage = "";
            //         result.statusCode = 200;
            //         return result;
            //     }
            // }

            
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
