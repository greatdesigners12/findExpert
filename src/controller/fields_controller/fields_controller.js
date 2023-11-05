import { db } from "../firebaseApp";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { ResultData } from "../structureJson/resultData";
import { Field } from "./models/field"; 
import { ExpertData } from "./models/expertData"; 


export async function getExpertsByFieldAndStatus(fieldId) {
    const result = new ResultData();

    try {
        const expertsCollection = collection(db, "expertData");
        const fieldExpertsQuery = query(expertsCollection, where("field_id", "==", fieldId), where("verified", "==", "yes"));
        const expertSnapshot = await getDocs(fieldExpertsQuery);

        const experts = [];
        expertSnapshot.forEach((expertDoc) => {
            const expertData = expertDoc.data();
            experts.push(
                new ExpertData(
                    expertData.id,
                    expertData.full_name,
                    expertData.field_id,
                    expertData.education,
                    expertData.KTP,
                    expertData.NIK,
                    expertData.certificate_images,
                    expertData.no_telp,
                    expertData.status
                )
            );
        });

        if (experts.length > 0) {
            result.data = experts;
            result.errorMessage = "";
            result.statusCode = 200;
        } else {
            result.data = null;
            result.errorMessage = "No verified experts found for this field";
            result.statusCode = 404;
        }
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to get verified experts by field: " + error.message;
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

