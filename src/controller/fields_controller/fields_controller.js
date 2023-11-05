import { db } from "../firebaseApp";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { ResultData } from "../structureJson/resultData";
import { Field } from "./models/field"; 
import { ExpertData } from "./models/expertData"; 

export async function getExpertsByFieldAndStatus(fieldId, currentPage, pageSize, existingData = []) {
    const result = new ResultData();

    try {
        const expertsCollection = collection(db, "expertData");
        const fieldExpertsQuery = query(expertsCollection, where("field_id", "==", fieldId), where("verified", "==", "yes"));
        const expertSnapshot = await getDocs(fieldExpertsQuery);

        const onlineExperts = [];
        const busyExperts = [];
        const offlineExperts = [];

        expertSnapshot.forEach((expertDoc) => {
            const expertData = expertDoc.data();
            const expert = new ExpertData(
                expertData.id,
                expertData.full_name,
                expertData.field_id,
                expertData.education,
                expertData.KTP,
                expertData.NIK,
                expertData.certificate_images,
                expertData.no_telp,
                expertData.status
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
                where("field_id", "==", fieldData.id),
                where("verified", "==", "yes") // Filter by verified experts
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

