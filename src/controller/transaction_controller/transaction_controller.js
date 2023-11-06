import { db } from "../firebaseApp";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Transaction } from "./models/transaction";
import { ResultData } from "../structureJson/resultData";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { UserData } from "../auth_controller/models/userData";

export class TransactionsController {
    async createTransaction(
        expert_id,
        customer_id,
        start_time,
        end_time,
        consultation_time,
        payment_amount,
        transaction_date,
        transaction_image,
        return_image
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
                "waiting",
                transactionImageName,
                return_image // Set return_image
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
                        transactionData.return_image
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

    async getTransactionByCustomer(user_id) {
        const result = new ResultData();
    
        try {
            const transactionsCollection = collection(db, "transactions");
            const transactionsQuery = query(transactionsCollection, where("customer_id", "==", user_id));
            const transactionSnapshot = await getDocs(transactionsQuery);
    
            const transactions = [];
            transactionSnapshot.forEach((doc) => {
                transactions.push({ id: doc.id, ...doc.data() });
            });
    
            if (transactions.length > 0) {
                result.data = transactions;
                result.errorMessage = "";
                result.statusCode = 200;
            } else {
                result.data = null;
                result.errorMessage = "No transactions found for the customer";
                result.statusCode = 404;
            }
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to get transactions for the customer: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    
    async updateTransactionStatusToOngoing(transactionId) {
        const result = new ResultData();
    
        try {
            const transactionsCollection = collection(db, "transactions");
            const transactionRef = doc(transactionsCollection, transactionId);
            const transactionSnapshot = await getDoc(transactionRef);
    
            if (transactionSnapshot.exists()) {
                // Check if the current transaction status is "waiting" to update it to "ongoing"
                if (transactionSnapshot.data().transaction_status === "waiting") {
                    // Calculate the start time and end time based on the amount in minutes
                    const currentTimestamp = new Date().toISOString();
                    const amount = transactionSnapshot.data().amount;
                    const startTime = currentTimestamp;
                    const endTime = new Date(new Date(startTime).getTime() + amount * 60000);
    
                    // Update the transaction status to "ongoing" and update start_time and end_time
                    await updateDoc(transactionRef, {
                        transaction_status: "ongoing",
                        start_time: startTime,
                        end_time: endTime.toISOString()
                    });
    
                    result.data = "ongoing";
                    result.errorMessage = "";
                    result.statusCode = 200;
                } else {
                    result.data = null;
                    result.errorMessage = "Transaction is not in 'waiting' status.";
                    result.statusCode = 400;
                }
            } else {
                result.data = null;
                result.errorMessage = "Transaction not found";
                result.statusCode = 404;
            }
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to update transaction status to 'ongoing': " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    
    

    async getAdminTransactions() {
        const result = new ResultData();
    
        try {
            const transactionsCollection = collection(db, "transactions");
            const adminTransactionsQuery = query(
                transactionsCollection,
                where("transaction_status", "in", ["waiting", "paid","cancel", "done"])
            );
    
            const transactionSnapshot = await getDocs(adminTransactionsQuery);
    
            const transactions = [];
            transactionSnapshot.forEach((transactionDoc) => {
                const transactionData = transactionDoc.data();
                transactions.push(transactionData);
            });
    
            result.data = transactions;
            result.errorMessage = "";
            result.statusCode = 200;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to get admin transactions: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    
    
    async updateTransactionByAdmin(id, newData) {
        const result = new ResultData();
    
        try {
            const transactionsCollection = collection(db, "transactions");
            const transactionRef = doc(transactionsCollection, id);
    
            if (newData.transaction_status) {
                if (newData.transaction_status === "paid" || newData.transaction_status === "unvalid") {
                    // Update the 'transaction_status' field
                    const updateData = {
                        transaction_status: newData.transaction_status
                    };
    
                    await updateDoc(transactionRef, updateData);
    
                    result.data = newData;
                    result.errorMessage = "";
                    result.statusCode = 200;
                } else if (newData.transaction_status === "refund") {
                    // Check if 'return_image' is provided in newData
                    if (newData.return_image) {
                        const imageType = "refund";
                        const imageName = new Date().getTime().toString() + `_${imageType}.png`;
                        const imageRef = ref(storage, `${imageType}Images/${imageName}`);
                        await uploadBytes(imageRef, newData.return_image);
    
                        const updateData = {
                            transaction_status: newData.transaction_status,
                            refund_image: imageName
                        };
    
                        await updateDoc(transactionRef, updateData);
    
                        result.data = newData;
                        result.errorMessage = "";
                        result.statusCode = 200;
                    } else {
                        result.data = null;
                        result.errorMessage = `Missing 'return_image' for 'refund' status.`;
                        result.statusCode = 400;
                    }
                } else if (newData.transaction_status === "end") {
                    // Update the 'transaction_status' field to "end"
                    const updateData = {
                        transaction_status: newData.transaction_status
                    };
    
                    // You should also update the expert's cash_amount here by adding the payment_amount
                    const transactionSnapshot = await getDoc(transactionRef);
                    const transactionData = transactionSnapshot.data();
                    const expertId = transactionData.expert_id;
    
                    const expertsCollection = collection(db, "expertData");
                    const expertRef = doc(expertsCollection, expertId);
                    const expertSnapshot = await getDoc(expertRef);
                    const expertData = expertSnapshot.data();
    
                    if (expertData) {
                        const newCashAmount = expertData.cash_amount + transactionData.payment_amount;
                        await updateDoc(expertRef, { cash_amount: newCashAmount });
                    } else {
                        result.data = null;
                        result.errorMessage = "Expert not found.";
                        result.statusCode = 400;
                        return result;
                    }
    
                    await updateDoc(transactionRef, updateData);
    
                    result.data = newData;
                    result.errorMessage = "";
                    result.statusCode = 200;
                } else {
                    result.data = null;
                    result.errorMessage = "Invalid 'transaction_status' provided.";
                    result.statusCode = 400;
                }
            } else {
                result.data = null;
                result.errorMessage = "Missing 'transaction_status' in the update data.";
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
    
            // Get the current timestamp
            const currentTimestamp = new Date().toISOString();
    
            if (newStatus === "Accept") {
                // Retrieve the amount from the transaction data
                const transactionData = (await getDoc(transactionRef)).data();
                const amount = transactionData.amount;
    
                // Calculate the end time based on the start time and amount
                const startTime = currentTimestamp;
                const minutesToAdd = amount; // Assume amount is the number of minutes to add
                const endTime = new Date(new Date(startTime).getTime() + minutesToAdd * 60000);
    
                // Update the 'transaction_status', 'start_time', and 'end_time' fields
                await updateDoc(transactionRef, {
                    transaction_status: "ready",
                    start_time: startTime,
                    end_time: endTime.toISOString()
                });
    
                // Update the expert status to "Busy"
                const expertId = transactionData.expert_id;
                await this.updateExpertStatus(expertId, "busy"); // Assuming there's a function to update expert status
            } else if (newStatus === "done") {
                // Retrieve the transaction data
                const transactionData = (await getDoc(transactionRef)).data();
    
                // Check if it has been at least 15 minutes since the transaction started
                const startTime = new Date(transactionData.start_time);
                const fifteenMinutesLater = new Date(startTime.getTime() + 15 * 60000);
    
                if (new Date(currentTimestamp) >= fifteenMinutesLater) {
                    // Update the 'transaction_status' to "done"
                    await updateDoc(transactionRef, {
                        transaction_status: "done"
                    });
    
                    // Update the expert status to "Online"
                    const expertId = transactionData.expert_id;
                    await this.updateExpertStatus(expertId, "online"); // Assuming there's a function to update expert status
    
                    result.data = newStatus;
                    result.errorMessage = "";
                    result.statusCode = 200;
                } else {
                    result.data = null;
                    result.errorMessage = "Transaction must be at least 15 minutes to be marked as 'done'.";
                    result.statusCode = 400;
                }
            } else if (newStatus === "cancel") {
                // Update the 'transaction_status' to "cancel"
                await updateDoc(transactionRef, {
                    transaction_status: "cancel"
                });
            } else {
                result.data = null;
                result.errorMessage = "Invalid status provided.";
                result.statusCode = 400;
            }
    
            result.data = newStatus;
            result.errorMessage = "";
            result.statusCode = 200;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to update transaction: " + error.message;
            result.statusCode = 500;
        }
    
        return result;
    }
    
    
    
    async getExpertByHistory(user_id) {
        const result = new ResultData();
    
        try {
            const transactionsCollection = collection(db, "transactions");
            const userTransactionsQuery = query(transactionsCollection, where("customer_id", "==", user_id), orderBy("transaction_date", "desc"));
            const transactionSnapshot = await getDocs(userTransactionsQuery);
    
            const experts = [];
            const uniqueExpertIds = new Set();
    
            for (const transactionDoc of transactionSnapshot.docs) {
                const transactionData = transactionDoc.data();
                const expert_id = transactionData.expert_id;
    
                if (!uniqueExpertIds.has(expert_id) && experts.length < 4) {
                    const expert = await this.getExpertById(expert_id); 
                    if (expert.statusCode === 200) {
                        experts.push(expert.data);
                        uniqueExpertIds.add(expert_id);
                    }
                }
    
                if (experts.length >= 4) {
                    break;
                }
            }
    
            result.data = experts;
            result.errorMessage = "";
            result.statusCode = 200;
        } catch (error) {
            result.data = null;
            result.errorMessage = "Failed to get experts by history: " + error.message;
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

export async function getExpertTransactionsById(expertId) {
    const result = new ResultData();

    try {
        const transactionsCollection = collection(db, "transactions");
        const expertTransactionsQuery = query(
            transactionsCollection,
            where("expert_id", "==", expertId),
            where("transaction_status", "in", ["ready", "paid", "ongoing"])
        );

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(expertTransactionsQuery, (snapshot) => {
            const transactions = [];
            snapshot.forEach((transactionDoc) => {
                const transactionData = transactionDoc.data();
                transactions.push(transactionData);
            });

            // Handle the updated data, e.g., update your UI with the new transactions
            result.data = transactions;
            result.errorMessage = "";
            result.statusCode = 200;
        });

        // Save the unsubscribe function so you can stop receiving updates later
        result.unsubscribe = unsubscribe;
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to get expert transactions: " + error.message;
        result.statusCode = 500;
    }

    return result;
}
