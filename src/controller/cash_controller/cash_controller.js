import { db } from "../firebaseApp";
import { collection, doc, getDocs, setDoc, updateDoc, query, where, getDoc } from "firebase/firestore";
import { Cash } from "./models/cash";
import { ResultData } from "../structureJson/resultData";

export class CashController {
    async getAllCashRecords(expertId) {
        const result = new ResultData();
    
        try {
            const cashCollection = collection(db, "cash");
            const cashQuery = query(cashCollection, where("expert_id", "==", expertId));
            const cashSnapshot = await getDocs(cashQuery);
    
            const cashRecords = [];
            cashSnapshot.forEach((cashDoc) => {
                const cashData = cashDoc.data();
                cashRecords.push(
                    new Cash(
                        cashData.amount,
                        cashData.id,
                        cashData.expert_id,
                        cashData.no_rek,
                        cashData.status,
                        cashData.withdraw_time,
                        cashData.account
                    )
                );
            });
    
            result.data = cashRecords;
            result.errorMessage = "";
            result.statusCode = 200;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to get cash records: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    
    async createCashRequest(expert_id, amount, no_rek, account) {
        const result = new ResultData();
    
        try {
            const cashCollection = collection(db, "cash");
            const cashRef = doc(cashCollection);
    
            const currentTimestamp = new Date().toISOString(); // Get the current timestamp
    
            const newCashRequest = new Cash(
                amount,
                cashRef.id,
                expert_id,
                no_rek,
                "request", // Initially, the status is set to "request"
                currentTimestamp, // Set the withdraw_time to the current timestamp
                account
            );
    
            await setDoc(cashRef, newCashRequest.serialize());
    
            result.data = newCashRequest;
            result.errorMessage = "";
            result.statusCode = 201;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to create a cash request: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    
    async updateCashRequest(cashRequestId, requestedAmount, image) {
        const result = new ResultData();
    
        try {
            const cashCollection = collection(db, "cash");
            const cashRef = doc(cashCollection, cashRequestId);
    
            const cashSnapshot = await getDoc(cashRef);
            const cashData = cashSnapshot.data();
    
            if (cashData && cashData.status === "request") {
                // Subtract the requested amount from the expert's cash_amount
                const expertId = cashData.expert_id;
                const expertsCollection = collection(db, "expertData");
                const expertRef = doc(expertsCollection, expertId);
    
                // Retrieve the expert's data
                const expertSnapshot = await getDoc(expertRef);
                const expertData = expertSnapshot.data();
    
                if (expertData) {
                    // Update the expert's cash_amount
                    const newCashAmount = expertData.cash_amount - requestedAmount;
                    await updateDoc(expertRef, { cash_amount: newCashAmount });
    
                    // Save the image to Firebase Storage with a specific naming convention
                    const storage = getStorage();
                    const imageName = new Date().getTime().toString() + "_cash_image.png";
                    const storageRef = ref(storage, 'cashImages/' + imageName);
                    await uploadBytes(storageRef, image);
                    const imageUrl = await getDownloadURL(storageRef);
    
                    // Update the cash record with the image and status
                    await updateDoc(cashRef, {
                        image: imageUrl,
                        status: "done"
                    });
    
                    result.data = "done";
                    result.errorMessage = "";
                    result.statusCode = 200;
                } else {
                    result.data = null;
                    result.errorMessage = "Expert not found.";
                    result.statusCode = 400;
                }
            } else {
                result.data = null;
                result.errorMessage = "Invalid cash request status or request not found.";
                result.statusCode = 400;
            }
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to update cash request: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
}
