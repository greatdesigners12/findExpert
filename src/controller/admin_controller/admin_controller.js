import { collection, query, where, getCountFromServer, updateDoc, getDoc, doc, getDocs, sum, getAggregateFromServer, startAfter, limit, orderBy } from "firebase/firestore";
import { db } from "../firebaseApp";
import { ResultData } from "../structureJson/resultData";

export async function updateTransactionStatus(id, isVerified=true) {
    const result = new ResultData();

    try {
        
        const transactionsCollection = collection(db, "transactions");
        const transactionRef = doc(transactionsCollection, id);

        const r = await updateDoc(transactionRef, {
            
            transaction_status:  isVerified ? "verified" : "rejected"
        });

        result.data = r;
        result.errorMessage = "";
        result.statusCode = 200;
        
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to update transaction: " + error.message;
        result.statusCode = 500;
    }

    return result;
}

export async function updateTransactionWithdrawStatus(id, isSuccess=true) {
    const result = new ResultData();

    try {
        
        const cashCollection = collection(db, "cash");
        const cashRef = doc(cashCollection, id);

        const r = await updateDoc(cashRef, {
            
            status:  isSuccess ? "done" : "failed"
        });

        result.data = r;
        result.errorMessage = "";
        result.statusCode = 200;
        
    } catch (error) {
        result.data = null;
        result.errorMessage = error.message;
        result.statusCode = 500;
    }

    return result;
}

export async function getTotalEquity(){
    const result = new ResultData();
    const cols = collection(db, 'transactions');
    const coll = collection(db, 'cash');
    const q = query(coll, where('status', '==', "done"));

    const snapshot = await getAggregateFromServer(cols, {
        totalEquity: sum('payment_amount')
    });

    const snapshot1 = await getAggregateFromServer(q, {
        totalWithdrawal: sum('amount')
    });


    result.data = snapshot.data().totalEquity - snapshot1.data().totalWithdrawal
    result.statusCode = 200
    result.errorMessage = null
    return result
}

export async function getTotalNumberTransactions(){
    const result = new ResultData();
    const cols = collection(db, "transactions");
    const snapshot = await getCountFromServer(cols);
    result.data = snapshot.data().count
    result.statusCode = 200
    result.errorMessage = null
    return result
}

export async function getTotalNumberConsultans(){
    const result = new ResultData();
    const cols = collection(db, "expertData");
    const q = query(cols, where("verified", "==", "true"));
    const snapshot = await getCountFromServer(q);
    result.data = snapshot.data().count
    result.statusCode = 200
    result.errorMessage = null
    return result
}



export async function updateExpertStatus(id, isVerified) {
    const result = new ResultData();

    try {
        
        const transactionsCollection = collection(db, "expertData");
        const transactionRef = doc(transactionsCollection, id);

        const r = await updateDoc(transactionRef, {
            
            verified: isVerified ? "verified" : "rejected"
        });

        result.data = r;
        result.errorMessage = "";
        result.statusCode = 200;
        
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to update expert status: " + error.message;
        result.statusCode = 400;
    }

    return result;
}

export async function getAllTransactions(start_at_page_num, limitNums=5) {
    const result = new ResultData();

    try {
       
        if(start_at_page_num === 1){
            const first = query(collection(db, "transactions"), orderBy("transaction_date"));
            
            const querySnapshot = await getDocs(first);
            const data = []
            querySnapshot.forEach(async (transactionDoc) => {
            // doc.data() is never undefined for query doc snapshots
                
            const expertRef = doc(db, "expertData", transactionDoc.data().expert_id)
            const expertSnap = await getDoc(expertRef);
            const userRef = doc(db, "userData", transactionDoc.data().customer_id)
            const userSnap = await getDoc(userRef);
            const curData = transactionDoc.data()
            curData["expertData"] = expertSnap.data()
            curData["customerData"] = userSnap.data()
            data.push(curData)
            });

            result.data = data;
            result.errorMessage = null;
            result.statusCode = 200;
            return result
        }
        const first = query(collection(db, "transactions"), orderBy("transaction_date"));
        const documentSnapshots = await getDocs(first);
        
        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        const next = query(collection(db, "transactions"),
            orderBy("transaction_date"),
            startAfter(lastVisible),
            limit(limitNums));
        
        const data = []
        const querySnapshot = await getDocs(next);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
           data.push(doc.data())
        });

        result.data = data;
        result.errorMessage = null;
        result.statusCode = 200;
        
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to update transaction: " + error.message;
        result.statusCode = 400;
    }

    return result;
       
}

export async function getAllUnverifiedTransactions() {
    const result = new ResultData();

    try {
      
        const first = query(collection(db, "transactions"), where("transaction_status", "==", "unverified"), orderBy("transaction_date"));
        
        const querySnapshot = await getDocs(first);
        const data = []
        querySnapshot.forEach(async (transactionDoc) => {
        // doc.data() is never undefined for query doc snapshots
            const expertRef = doc(db, "expertData", transactionDoc.data().expert_id)
            const expertSnap = await getDoc(expertRef);
            const userRef = doc(db, "userData", transactionDoc.data().customer_id)
            const userSnap = await getDoc(userRef);
            const fieldRef = doc(db, "field", expertSnap.data().fieldId)
            const fieldSnap = await getDoc(fieldRef);
            const curData = transactionDoc.data()
            curData["expertData"] = expertSnap.data()
            curData.expertData["fieldData"] = fieldSnap.data() 
            curData["customerData"] = userSnap.data()
            data.push(curData)
        });

        result.data = data;
        result.errorMessage = null;
        result.statusCode = 200;
        
        
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to update transaction: " + error.message;
        result.statusCode = 400;
    }

    return result;
       
}

export async function getAllUnverifiedTransactionsWithPagination(start_at_page_num, limitNums=5) {
    const result = new ResultData();

    try {
      

        if(start_at_page_num === 1){
            const first = query(collection(db, "transactions"), where("transaction_status", "==", "unverified"), orderBy("transaction_date"));
            
            const querySnapshot = await getDocs(first);
            const data = []
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                data.push(doc.data())
            });

            result.data = data;
            result.errorMessage = null;
            result.statusCode = 200;
            return result
        }
        const first = query(collection(db, "transactions"), where("transaction_status", "==", "unverified"), orderBy("transaction_date"));
        const documentSnapshots = await getDocs(first);
        
        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        const next = query(collection(db, "transactions"), where("transaction_status", "==", "unverified"),
            orderBy("transaction_date"),
            startAfter(lastVisible),
            limit(limitNums));
        
        const data = []
        const querySnapshot = await getDocs(next);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
           data.push(doc.data())
        });

        result.data = data;
        result.errorMessage = null;
        result.statusCode = 200;
        
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to update transaction: " + error.message;
        result.statusCode = 400;
    }

    return result;
       
}

export async function getAllUnverifiedExpertsWithPagination(start_at_page_num, limitNums=5) {
    const result = new ResultData();

    try {
        
        
        if(start_at_page_num === 1){
            const first = query(collection(db, "expertData"), where("verified", "==", "false"), orderBy("fullName"), limit(limitNums));
            
            const querySnapshot = await getDocs(first);
            const data = []
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                data.push(doc.data())
            });

            result.data = data;
            result.errorMessage = null;
            result.statusCode = 200;
            return result
        }
        const first = query(collection(db, "expertData"), where("status", "==", "unverified"), orderBy("fullName"), limit((start_at_page_num - 1) * limitNums));
        const documentSnapshots = await getDocs(first);
        
        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        const next = query(collection(db, "expertData"), where("status", "==", "unverified"),
            orderBy("fullName"),
            startAfter(lastVisible),
            limit(limitNums));
        
        const data = []
        const querySnapshot = await getDocs(next);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
           data.push(doc.data())
        });

        result.data = data;
        result.errorMessage = null;
        result.statusCode = 200;
    } catch (error) {
        result.data = null;
        result.errorMessage = error.message;
        result.statusCode = 400;
    }

    return result;
       
}

export async function getAllUnverifiedExperts() {
    const result = new ResultData();

    try {
        
        const first = query(collection(db, "expertData"), where("verified", "==", "false"), orderBy("registered_date"));
            
            const querySnapshot = await getDocs(first);
            const data = []
            querySnapshot.forEach(async (expertDoc) => {
                const fieldRef = doc(db, "field", expertDoc.data().fieldId)
                const fieldSnap = await getDoc(fieldRef);
                const curData = expertDoc.data()
                curData["fieldData"] = fieldSnap.data()
            // doc.data() is never undefined for query doc snapshots
                data.push(curData)
            });

            result.data = data;
            result.errorMessage = null;
            result.statusCode = 200;
            return result
        
       
    } catch (error) {
        result.data = null;
        result.errorMessage = error.message;
        result.statusCode = 400;
    }

    return result;
       
}

export async function getAllUnverifiedWithdrawalRequestWithPagination(start_at_page_num, limitNums=5) {
    const result = new ResultData();

    try {
        if(start_at_page_num === 1){
            const first = query(collection(db, "cash"), where("status", "==", "unverified"), orderBy("withdraw_time"));
            
            const querySnapshot = await getDocs(first);
            const data = []
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                data.push(doc.data())
            });

            result.data = data;
            result.errorMessage = null;
            result.statusCode = 200;
            return result
        }
        const first = query(collection(db, "cash"), where("status", "==", "unverified"), orderBy("withdraw_time"));
        const documentSnapshots = await getDocs(first);
        
        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        const next = query(collection(db, "cash"), where("status", "==", "unverified"),
            orderBy("withdraw_time"),
            startAfter(lastVisible),
            limit(limitNums));
        
        const data = []
        const querySnapshot = await getDocs(next);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
           data.push(doc.data())
        });

        result.data = data;
        result.errorMessage = null;
        result.statusCode = 200;
    } catch (error) {
        result.data = null;
        result.errorMessage = error.message;
        result.statusCode = 400;
    }

    return result;
       
}

export async function getAllUnverifiedWithdrawalRequest() {
    const result = new ResultData();

    try {
        const first = query(collection(db, "cash"), where("status", "==", "unverified"), orderBy("withdraw_time"));
            
        const querySnapshot = await getDocs(first);
        const data = []
        querySnapshot.forEach(async (cashDoc) => {
        // doc.data() is never undefined for query doc snapshots
            
            const expertData = await getDoc(cashDoc.data().expert_id);
            
            const curData = cashDoc.data()
            curData["expertData"] = expertData.data()
            console.log(curData)
            data.push(curData)
        });
        result.data = data;
        result.errorMessage = null;
        result.statusCode = 200;
    } catch (error) {
        result.data = null;
        result.errorMessage = error.message;
        result.statusCode = 400;
    }

    return result;
       
}

export async function getAllFields(start_at_page_num, limitNums=5) {
    const result = new ResultData();

    try {
        if(start_at_page_num === 1){
            const first = query(collection(db, "field"), orderBy("name"), limit(limitNums));
            
            const querySnapshot = await getDocs(first);
            const data = []
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                data.push(doc.data())
            });

            result.data = data;
            result.errorMessage = null;
            result.statusCode = 200;
            return result
        }
        const first = query(collection(db, "field"), orderBy("name"), limit((start_at_page_num - 1) * limitNums));
        const documentSnapshots = await getDocs(first);
        
        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        const next = query(collection(db, "field"),
            orderBy("name"),
            startAfter(lastVisible),
            limit(limitNums));
        
        const data = []
        const querySnapshot = await getDocs(next);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
           data.push(doc.data())
        });

        result.data = data;
        result.errorMessage = null;
        result.statusCode = 200;
        
    } catch (error) {
        result.data = null;
        result.errorMessage = error.message;
        result.statusCode = 400;
    }

    return result;
       
}
