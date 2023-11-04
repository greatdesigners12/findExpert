import { db } from "../firebaseApp";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Transaction } from "./models/transaction";
import { ResultData } from "../structureJson/resultData";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export class TransactionsController {
    async createTransaction(
        expert_id,
        customer_id,
        start_time,
        end_time,
        consultation_time,
        payment_amount,
        transaction_date,
        transaction_image
    ) {
        const result = new ResultData();
    
        try {
            const transactionsCollection = collection(db, "transactions");
    
            // Upload transaction_image to Firebase Storage
            const storage = getStorage();
            const transactionImageName = new Date().getTime().toString() + ".png";
            const transactionImageRef = ref(storage, 'transactionImages/' + transactionImageName);
            await uploadBytes(transactionImageRef, transaction_image);
    
            const newTransaction = new Transaction(
                null,
                expert_id,
                customer_id,
                start_time,
                end_time,
                consultation_time,
                payment_amount,
                transaction_date,
                "waiting", // Set the transaction status to "waiting"
                transactionImageName, // Set the transaction image file name
                null // Set refund_image to null for now
            );
    
            const docRef = await setDoc(transactionsCollection, newTransaction.serialize());
            const createdTransaction = { ...newTransaction, id: docRef.id };
            result.data = createdTransaction;
            result.errorMessage = "";
            result.statusCode = 201;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to create a transaction: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    
    async getTransactionById(id) {
        const result = new ResultData();

        try {
            const transactionsCollection = collection(db, "transactions");
            const transactionSnapshot = await getDocs(transactionsCollection);

            for (const transactionDoc of transactionSnapshot.docs) {
                const transactionData = transactionDoc.data();
                if (transactionData.id === id) {
                    result.data = new Transaction(
                        transactionData.id,
                        transactionData.expert_id,
                        transactionData.customer_id,
                        transactionData.start_time,
                        transactionData.end_time,
                        transactionData.consultation_time,
                        transactionData.payment_amount,
                        transactionData.transaction_date,
                        transactionData.transaction_status,
                        transactionData.transaction_image,
                        transactionData.refund_image
                    );
                    result.errorMessage = "";
                    result.statusCode = 200;
                    return result;
                }
            }

            result.data = null;
            result.errorMessage = "Transaction not found";
            result.statusCode = 404;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to get transaction: " + error.message;
            result.statusCode = 500;
        }

        return result;
    }

    async updateTransactionByAdmin(id, newData) {
        const result = new ResultData();
    
        try {
            const transactionsCollection = collection(db, "transactions");
            const transactionRef = doc(transactionsCollection, id);
    
            // Check if the 'refund_image' and 'transaction_status' fields are provided in newData
            if (newData.refund_image !== undefined && newData.transaction_status !== undefined) {
                // Update the 'refund_image' and 'transaction_status' fields
                await updateDoc(transactionRef, {
                    refund_image: newData.refund_image,
                    transaction_status: newData.transaction_status
                });
    
                result.data = newData;
                result.errorMessage = "";
                result.statusCode = 200;
            } else {
                result.data = null;
                result.errorMessage = "Missing 'refund_image' and 'transaction_status' fields in the update data.";
                result.statusCode = 400;
            }
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to update transaction: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    async updateTransactionByExpert(id, newStatus) {
        const result = new ResultData();
    
        try {
            const transactionsCollection = collection(db, "transactions");
            const transactionRef = doc(transactionsCollection, id);
    
            // Check if the 'transaction_status' field is provided
            if (newStatus !== undefined) {
                // Update the 'transaction_status' field
                await updateDoc(transactionRef, {
                    transaction_status: newStatus
                });
    
                result.data = newStatus;
                result.errorMessage = "";
                result.statusCode = 200;
            } else {
                result.data = null;
                result.errorMessage = "Missing 'transaction_status' field in the update data.";
                result.statusCode = 400;
            }
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to update transaction: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    

    async deleteTransaction(id) {
        const result = new ResultData();

        try {
            const transactionsCollection = collection(db, "transactions");
            const transactionRef = doc(transactionsCollection, id);

            await deleteDoc(transactionRef);

            result.data = null;
            result.errorMessage = "";
            result.statusCode = 200;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to delete transaction: " + error.message;
            result.statusCode = 500;
        }

        return result;
    }
}
