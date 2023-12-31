import { db } from "../firebaseApp";
import {
  onSnapshot,
  orderBy,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  startAfter,
  limit,
  Timestamp,
} from "firebase/firestore";
import { Transaction } from "./models/transactions";
import { collection, getDocs, setDoc } from "firebase/firestore";
import { ResultData } from "../structureJson/resultData";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Expert } from "../experts_controller/models/expert";

export async function createTransaction(transaction) {
  const result = new ResultData();
  const {
    id,
    expert_id,
    customer_id,
    start_time,
    end_time,
    consultation_time,
    payment_amount,
    transaction_date,
    transaction_status,
    transaction_image,
    return_image,
  } = transaction;
  try {
    const transactionsCollection = collection(db, "transactions");

    // Upload transaction_image to Firebase Storage
    const storageRef = getStorage();
    const transactionImageName = new Date().getTime().toString() + ".png";
    const transactionImageRef = ref(
      storageRef,
      "transaction_images/" + transactionImageName
    );
    var img = "";
    console.log(transaction_image);
    await uploadBytes(transactionImageRef, transaction_image[0]).then(
      async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((downloadURL) => {
          img = downloadURL;
        });
      }
    );
    // Get the download URL for the uploaded image
    const newTransaction = new Transaction(
      "transaction_" + new Date().getTime().toString(),
      expert_id,
      customer_id,
      start_time,
      end_time,
      consultation_time,
      payment_amount,
      transaction_date,
      transaction_status,
      img, // Set download URL as the image name
      return_image
    );

    const docRef = await setDoc(
      doc(db, "transactions", newTransaction.id),
      newTransaction.serialize()
    );
    console.log(docRef);
    const createdTransaction = { ...newTransaction };
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

export async function getTransactionById(id) {
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

export async function updateTransactionStatusToOngoing(transactionId) {
  const result = new ResultData();

  try {
    const transactionsCollection = collection(db, "transactions");
    const transactionRef = doc(transactionsCollection, transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if (transactionSnapshot.exists()) {
      // Check if the current transaction status is "waiting" to update it to "ongoing"
      if (transactionSnapshot.data().transaction_status === "waiting" || transactionSnapshot.data().transaction_status === "verified") {
        // Use new Date() for current time (local time)
        const currentTimestamp = Timestamp.fromDate(new Date());
        const amount = transactionSnapshot.data().consultation_time;

        // Calculate the end time based on the amount in minutes
        const endTime = Timestamp.fromDate(
          new Date(new Date().getTime() + amount * 60000)
        );

        // Update the transaction status to "ongoing" and update start_time and end_time
        await updateDoc(transactionRef, {
          transaction_status: "ongoing",
          start_time: currentTimestamp,
          end_time: endTime,
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
    result.errorMessage =
      "Failed to update transaction status to 'ongoing': " + error.message;
    result.statusCode = 500;
  }

  return result;
}

export async function getAdminTransactions() {
  const result = new ResultData();

  try {
    const transactionsCollection = collection(db, "transactions");
    const adminTransactionsQuery = query(
      transactionsCollection,
      where("transaction_status", "in", ["waiting", "paid", "cancel", "done"])
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

export async function updateTransactionByAdmin(id, newData) {
  const result = new ResultData();
  const storage = getStorage();
  try {
    const transactionsCollection = collection(db, "transactions");
    const transactionRef = doc(transactionsCollection, id);

    if (newData.transaction_status) {
      if (
        newData.transaction_status === "paid" ||
        newData.transaction_status === "unvalid"
      ) {
        // Update the 'transaction_status' field
        const updateData = {
          transaction_status: newData.transaction_status,
        };

        await updateDoc(transactionRef, updateData);

        result.data = newData;
        result.errorMessage = "";
        result.statusCode = 200;
      } else if (newData.transaction_status === "refund") {
        // Check if 'return_image' is provided in newData
        if (newData.return_image) {
          const imageType = "refund";
          const imageName =
            new Date().getTime().toString() + `_${imageType}.png`;
          const imageRef = ref(storage, `transaction_images/${imageName}`);
          await uploadBytes(imageRef, newData.return_image);

          const updateData = {
            transaction_status: newData.transaction_status,
            refund_image: imageName,
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
          transaction_status: newData.transaction_status,
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
          const newCashAmount =
            expertData.cash_amount + transactionData.payment_amount;
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

export async function updateTransactionStatus(id, isAccepted = true) {
  const result = new ResultData();

  try {
    const transactionsCollection = collection(db, "transactions");
    const transactionRef = doc(transactionsCollection, id);

    const r = await updateDoc(transactionRef, {
      transaction_status: isAccepted ? "waiting" : "cancel",
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

export async function updateTransactionByExpert(id, newStatus) {
  const result = new ResultData();

  try {
    const transactionsCollection = collection(db, "transactions");
    const transactionRef = doc(transactionsCollection, id);

    // Get the current local timestamp
    const currentTimestamp = new Date();

    if (newStatus === "Accept") {
      // Retrieve the amount from the transaction data
      const transactionData = (await getDoc(transactionRef)).data();
      const amount = transactionData.amount;

      // Calculate the end time based on the start time and amount
      const startTime = currentTimestamp;
      const endTime = new Date(startTime.getTime() + amount * 30 * 60000);
      // Calculate the end time based on the start time and amount

      // Update the 'transaction_status', 'start_time', and 'end_time' fields
      await updateDoc(transactionRef, {
        transaction_status: "ready",
        start_time: startTime,
        end_time: endTime,
      });

      // Assuming you have access to the expert document or data
      const expertId = transactionData.expert_id;
      const expertRef = doc(collection(db, "expertData"), expertId);

      // Update the expert status directly
      await updateDoc(expertRef, {
        status: "busy", // Change "busy" to the desired status
      });
    } else if (newStatus === "done") {
      // Retrieve the transaction data
      const transactionData = (await getDoc(transactionRef)).data();

      // Check if it has been at least 15 minutes since the transaction started
      // const startTime = new Date(transactionData.start_time.seconds * 1000);
      // const fifteenMinutesLater = new Date(startTime.getTime() + 15 * 60000);
      // console.log(startTime)
      // console.log(fifteenMinutesLater)
      
        // Update the 'transaction_status' to "done"
        await updateDoc(transactionRef, {
          transaction_status: "done",
        });

        // Assuming you have access to the expert document or data
        const expertId = transactionData.expert_id;
        const expertRef = doc(collection(db, "expertData"), expertId);

        // Update the expert status directly
        await updateDoc(expertRef, {
          status: "online", // Change "online" to the desired status
        });

        result.data = newStatus;
        result.errorMessage = "";
        result.statusCode = 200;
      
    } else if (newStatus === "cancel") {
      // Update the 'transaction_status' to "cancel"
      await updateDoc(transactionRef, {
        transaction_status: "cancel",
      });
    } else {
      result.data = null;
      result.errorMessage = "Invalid status provided.";
      result.statusCode = 400;
    }
  } catch (error) {
    result.data = null;
    result.errorMessage = "Failed to update transaction: " + error.message;
    result.statusCode = 500;
  }

  return result;
}export async function getLatestExpertTransaction(user_id) {
  const result = new ResultData();

  try {
    const transactionsCollection = collection(db, "transactions");
    const userTransactionsQuery = query(
      transactionsCollection,
      where("customer_id", "in", [user_id])
    );

    const transactionSnapshot = await getDocs(userTransactionsQuery);

    // Mengurutkan transaksi berdasarkan tanggal secara manual
    const sortedTransactions = transactionSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.transaction_date - a.transaction_date);

    // Mengambil 4 transaksi terbaru
    const latestTransactions = sortedTransactions.slice(0, 4);

    const expertTransactions = [];

    for (const transactionData of latestTransactions) {
      const id = transactionData.expert_id;

      // Mendapatkan data expert menggunakan expert_id
      const expertDoc = await getDoc(doc(db, "expertData", id));
      const expertData = expertDoc.data();

      const expert = new Expert(
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
        expertData.cash_amount,
        expertData.price,
        expertData.id,
        expertData.registered_date
      );

      expertTransactions.push({
        transaction: transactionData,
        expert: expert,
      });
    }

    result.data = expertTransactions;
    result.errorMessage = "";
    result.statusCode = 200;
  } catch (error) {
    result.data = null;
    result.errorMessage =
      "Failed to get latest expert transactions: " + error.message;
    result.statusCode = 500;
  }

  return result;
}


export async function deleteTransaction(id) {
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

export async function getExpertTransactionsById(
  expertId,
  currentPage,
  pageSize
) {
  const result = new ResultData();

  try {
    const transactionsCollection = collection(db, "transactions");
    const expertTransactionsQuery = query(
      transactionsCollection,
      where("expert_id", "==", expertId),
      where(
        "transaction_status",
        "in",
        ["ongoing", "verified"],
        orderBy("transaction_status", "desc") // Sort by transaction_status in ascending order
      )
    );

    const startAfterDocument =
      currentPage > 1
        ? await getDocumentToStartAfter(
            expertTransactionsQuery,
            pageSize,
            currentPage
          )
        : null;

    let queryWithPagination = expertTransactionsQuery;
    if (startAfterDocument) {
      queryWithPagination = startAfter(queryWithPagination, startAfterDocument);
    }

    const transactionsSnapshot = await getDocs(queryWithPagination);

    const transactions = [];
    for (const transactionDoc of transactionsSnapshot.docs) {
      const transactionData = transactionDoc.data();

      try {
        const userRef = doc(db, "userData", transactionData.customer_id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          transactionData["customerData"] = userSnap.data();
        } else {
          // Handle the case where customer data is not found
          transactionData["customerData"] = null;
        }
      } catch (error) {
        // Handle any error that might occur while fetching customer data
        console.error("Error fetching customer data:", error.message);
        transactionData["customerData"] = null;
      }
      transactions.push(transactionData);
    }

    result.data = transactions;
    result.errorMessage = "";
    result.statusCode = 200;
  } catch (error) {
    result.data = null;
    result.errorMessage = "Failed to get expert transactions: " + error.message;
    result.statusCode = 500;
  }

  return result;
}

export async function getExpertTransactionsById2(
  expertId,
  currentPage,
  pageSize
) {
  const result = new ResultData();

  try {
    const transactionsCollection = collection(db, "transactions");
    const expertTransactionsQuery = query(
      transactionsCollection,
      where("expert_id", "==", expertId),
      where(
        "transaction_status",
        "in",
        ["on going", "done", "cancel", "verified", "unverified"],
        orderBy("transaction_date", "desc")
      )
    );

    const startAfterDocument =
      currentPage > 1
        ? await getDocumentToStartAfter(
            expertTransactionsQuery,
            pageSize,
            currentPage
          )
        : null;

    let queryWithPagination = expertTransactionsQuery;
    if (startAfterDocument) {
      queryWithPagination = startAfter(queryWithPagination, startAfterDocument);
    }

    const transactionsSnapshot = await getDocs(queryWithPagination);

    const transactions = [];
    for (const transactionDoc of transactionsSnapshot.docs) {
      const transactionData = transactionDoc.data();

      try {
        const userRef = doc(db, "userData", transactionData.customer_id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          transactionData["customerData"] = userSnap.data();
        } else {
          // Handle the case where customer data is not found
          transactionData["customerData"] = null;
        }
      } catch (error) {
        // Handle any error that might occur while fetching customer data
        console.error("Error fetching customer data:", error.message);
        transactionData["customerData"] = null;
      }
      transactions.push(transactionData);
    }

    result.data = transactions;
    result.errorMessage = "";
    result.statusCode = 200;
  } catch (error) {
    result.data = null;
    result.errorMessage = "Failed to get expert transactions: " + error.message;
    result.statusCode = 500;
  }

  return result;
}

async function getDocumentToStartAfter(query, pageSize, currentPage) {
  const snapshot = await getDocs(query.limit(pageSize));
  const documents = snapshot.docs;

  if (documents.length === pageSize) {
    const lastDocument = documents[pageSize - 1];
    return lastDocument;
  } else if (currentPage > 1) {
    // If the current page is greater than 1, there's no more data to fetch
    return null;
  } else {
    return null;
  }
}
