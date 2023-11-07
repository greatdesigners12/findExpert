import { db } from "../firebaseApp";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { ResultData } from "../structureJson/resultData";
import { Field } from "./models/field"; 
import { Expert } from "../experts_controller/models/expert"; 

export async function getExpertsByFieldAndStatus(fieldId, currentPage, pageSize, existingData = []) {
    const result = new ResultData();

    try {
        const expertsCollection = collection(db, "expertData");
        const fieldExpertsQuery = query(expertsCollection, where("fieldId", "==", fieldId), where("verified", "==", "true"));
        const expertSnapshot = await getDocs(fieldExpertsQuery);

        const onlineExperts = [];
        const busyExperts = [];
        const offlineExperts = [];

        expertSnapshot.forEach((expertDoc) => {
            const expertData = expertDoc.data();
            const expert = new Expert(
                expertData.id,
                expertData.full_name,
                expertData.fieldId,
                expertData.education,
                expertData.KTP,
                expertData.NIK,
                expertData.certificate_images,
                expertData.no_telp,
                expertData.status,
                expertData.cash_amount
            );

            // Categorize experts based on their status.
            if (expertData.status === "online") {
                onlineExperts.push(expert);
            } else if (expertData.status === "busy") {
                busyExperts.push(expert);
            } else {
                offlineExperts.push(expert);
            }
        });

        // Sort online experts at the top, followed by busy and then offline.
        const sortedExperts = onlineExperts.concat(busyExperts, offlineExperts);

        // Calculate the start and end indices based on the current page and page size.
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Get the experts to show for the current page.
        const expertsToShow = sortedExperts.slice(startIndex, endIndex);

        // Accumulate the newly fetched data with existingData.
        const allData = existingData.concat(expertsToShow);

        if (expertsToShow.length > 0) {
            result.data = allData;
            result.errorMessage = "";
            result.statusCode = 200;
        } else {
            result.data = null;
            result.errorMessage = "No more experts found for this field";
            result.statusCode = 404;
        }
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to get experts by field and status: " + error.message;
        result.statusCode = 500;
    }

    return result;
}


export async function getAllFieldsWithExperts() {
    const result = new ResultData();

    try {
        const fieldsCollection = collection(db, "field");
        const fieldSnapshot = await getDocs(fieldsCollection);

        const fields = [];
        for (const fieldDoc of fieldSnapshot.docs) {
            const fieldData = fieldDoc.data();
            const field = new Field(fieldData.id, fieldData.name, fieldData.icon, fieldData.description);

            const fieldExpertsQuery = query(collection(db, "expertData"),
                where("fieldId", "==", fieldData.id),
                where("verified", "==", "true")
            );

            const fieldExpertsSnapshot = await getDocs(fieldExpertsQuery);

            if (fieldExpertsSnapshot.size > 0) {
                fields.push(field);
            }
        }

        if (fields.length > 0) {
            result.data = fields;
            result.errorMessage = "";
            result.statusCode = 200;
        } else {
            result.data = null;
            result.errorMessage = "No fields with verified experts found"; // Update the error message
            result.statusCode = 404;
        }
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to get all fields with experts: " + error.message;
        result.statusCode = 500;
    }

    return result;
}

export async function searchFieldsAndExperts(queryText, currentPage, pageSize) {
    const result = new ResultData();

    try {
        const fieldsCollection = collection(db, "field");
        const fieldSnapshot = await getDocs(fieldsCollection);

        const searchResults = [];
        for (const fieldDoc of fieldSnapshot.docs) {
            const fieldData = fieldDoc.data();
            const field = new Field(fieldData.id, fieldData.name, fieldData.icon, fieldData.description);

            // Add fields to search results if their names contain the queryText
            if (field.name.toLowerCase().includes(queryText.toLowerCase())) {
                searchResults.push({ type: 'field', data: field });
            }

            const fieldExpertsQuery = query(collection(db, "expertData"),
                where("fieldId", "==", fieldData.id),
                where("verified", "==", "true"),
                where("full_name", "array-contains", queryText) 
            );

            const fieldExpertsSnapshot = await getDocs(fieldExpertsQuery);

            for (const expertDoc of fieldExpertsSnapshot.docs) {
                const expertData = expertDoc.data();
                const expert = new Expert(
                    expertData.id,
                    expertData.full_name,
                    expertData.fieldId,
                    expertData.education,
                    expertData.KTP,
                    expertData.NIK,
                    expertData.certificate_images,
                    expertData.no_telp,
                    expertData.status,
                    expertData.cash_amount
                );

                searchResults.push({ type: 'expert', data: expert });
            }
        }

        // Calculate the start and end indices based on the current page and page size.
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Get the search results to show for the current page.
        const resultsToShow = searchResults.slice(startIndex, endIndex);

        if (resultsToShow.length > 0) {
            result.data = resultsToShow;
            result.errorMessage = "";
            result.statusCode = 200;
        } else {
            result.data = null;
            result.errorMessage = "No results found for the given query.";
            result.statusCode = 404;
        }
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to search for fields and experts: " + error.message;
        result.statusCode = 500;
    }

    return result;
}

