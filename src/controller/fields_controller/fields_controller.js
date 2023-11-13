import { db } from "../firebaseApp";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { ResultData } from "../structureJson/resultData";
import { Field } from "./models/field";
import { Expert } from "../experts_controller/models/expert";

export async function getExpertsByFieldAndStatus(fieldId) {
    const result = new ResultData();

    try {
        const expertsCollection = collection(db, "expertData");
        const fieldExpertsQuery = query(expertsCollection, where("fieldId", "==", fieldId), where("verified", "==", "true"));
        const expertSnapshot = await getDocs(fieldExpertsQuery);

        const onlineExperts = [];
        const busyExperts = [];
        const offlineExperts = [];

        expertSnapshot.docs.forEach((expertDoc) => {
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
                    expertData.id
            );

            if (expertData.status === 'online') {
                onlineExperts.push(expert);
            } else if (expertData.status === 'busy') {
                busyExperts.push(expert);
            } else {
                offlineExperts.push(expert);
            }
        });

        // Concatenate the results in the order: online, busy, offline
        const expertsList = onlineExperts.concat(busyExperts, offlineExperts);

        if (expertsList.length > 0) {
            result.data = expertsList;
            result.errorMessage = "";
            result.statusCode = 200;
        } else {
            result.data = null;
            result.errorMessage = "No experts found for this field";
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

export async function searchFieldsAndExperts(queryText) {
    const result = new ResultData();

    try {
        const fieldsCollection = collection(db, "field");
        const fieldSnapshot = await getDocs(fieldsCollection);

        const searchResults = [];

        for (const fieldDoc of fieldSnapshot.docs) {
            const fieldData = fieldDoc.data();
            const field = new Field(fieldData.id, fieldData.name, fieldData.icon, fieldData.description);

            // Query to check if there's any verified expert
            const expertQuery = query(collection(db, "expertData"),
                where("verified", "==", "true")
            );

            const expertSnapshot = await getDocs(expertQuery);

            // Compare lowercase field name with lowercase queryText
            const fieldNameLowerCase = field.name.toLowerCase();
            const queryTextLowerCase = queryText.toLowerCase();

            if (fieldNameLowerCase.includes(queryTextLowerCase)) {
                searchResults.push({ type: 'field', data: field });
            }

            const onlineResults = [];
            const busyResults = [];
            const offlineResults = [];

            expertSnapshot.forEach((expertDoc) => {
                const expertData = expertDoc.data();

                // Compare lowercase fullName with lowercase queryText
                const fullNameLowerCase = expertData.fullName.toLowerCase();

                if (fullNameLowerCase.includes(queryTextLowerCase)) {
                    // Create an instance of the Expert class
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
                        expertData.id
                    );

                    if (expertData.status === 'online') {
                        onlineResults.push({ type: 'expert', data: expert });
                    } else if (expertData.status === 'busy') {
                        busyResults.push({ type: 'expert', data: expert });
                    } else {
                        offlineResults.push({ type: 'expert', data: expert });
                    }
                }
            });

            // Concatenate the results in the order: online, busy, offline
            const finalResults = onlineResults.concat(busyResults, offlineResults);

            if (finalResults.length > 0) {
                searchResults.push(...finalResults);
            }
        }

        if (searchResults.length > 0) {
            result.data = searchResults;
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


export async function searchFieldsWithExperts(queryText) {
    const result = new ResultData();

    try {
        const fieldsCollection = collection(db, "field");
        const fieldSnapshot = await getDocs(fieldsCollection);

        const searchResults = [];

        for (const fieldDoc of fieldSnapshot.docs) {
            const fieldData = fieldDoc.data();
            const field = new Field(fieldData.id, fieldData.name, fieldData.icon, fieldData.description);

            // Query to check if there's a verified expert with the current field
            const expertQuery = query(collection(db, "expertData"),
                where("fieldId", "==", fieldData.id),
                where("verified", "==", "true")
            );

            const expertSnapshot = await getDocs(expertQuery);

            // If there's at least one verified expert with the current field, include the field in search results
            if (!expertSnapshot.empty) {
                // Compare lowercase field name with lowercase queryText
                const fieldNameLowerCase = field.name.toLowerCase();
                const queryTextLowerCase = queryText.toLowerCase();

                if (fieldNameLowerCase.includes(queryTextLowerCase)) {
                    searchResults.push({ type: 'field', data: field });
                }
            }
        }

        if (searchResults.length > 0) {
            result.data = searchResults;
            result.errorMessage = "";
            result.statusCode = 200;
        } else {
            result.data = null;
            result.errorMessage = "No results found for the given query.";
            result.statusCode = 404;
        }
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to search for fields with experts: " + error.message;
        result.statusCode = 500;
    }

    return result;
}


export async function searchExpertsInField(fieldId, queryText) {
    const result = new ResultData();

    try {
        const fieldExpertsQuery = query(collection(db, "expertData"),
            where("fieldId", "==", fieldId),
            where("verified", "==", "true")
        );

        const fieldExpertsSnapshot = await getDocs(fieldExpertsQuery);
        console.log("query", fieldExpertsQuery);
        const searchResults = [];
        const onlineResults = [];
        const busyResults = [];
        const offlineResults = [];

        fieldExpertsSnapshot.forEach((expertDoc) => {
            const expertData = expertDoc.data();

            // Compare lowercase fullName with lowercase queryText
            const fullNameLowerCase = expertData.fullName.toLowerCase();
            const queryTextLowerCase = queryText.toLowerCase();

            if (fullNameLowerCase.includes(queryTextLowerCase)) {
                // Create an instance of the Expert class
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
                    expertData.id
                );
                

                if (expertData.status === 'online') {
                    onlineResults.push({ type: 'expert', data: expert });
                } else if (expertData.status === 'busy') {
                    busyResults.push({ type: 'expert', data: expert });
                } else {
                    offlineResults.push({ type: 'expert', data: expert });
                }
            }
        });

        // Concatenate the results in the order: online, busy, offline
        const finalResults = onlineResults.concat(busyResults, offlineResults);

        if (finalResults.length > 0) {
            result.data = finalResults;
            result.errorMessage = "";
            result.statusCode = 200;
        } else {
            result.data = null;
            result.errorMessage = "No results found for the given query.";
            result.statusCode = 404;
        }
    } catch (error) {
        result.data = null;
        result.errorMessage = "Failed to search for experts in the field: " + error.message;
        result.statusCode = 500;
    }

    return result;
}
