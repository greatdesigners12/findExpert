import { db, app } from "../firebaseApp";
import { collection, doc, getDocs } from "firebase/firestore"; 

export async function getAllExpertsData ()  {
    
    const querySnapshot = await getDocs(collection(db, "experts"));
    const result = [];
    querySnapshot.forEach((dt) => {
        result.push(dt.data());
    });
   
    return result;
    

}

// home 

// login

// register

// expert list 

// expert description 

// livechat

// expert verification page

// payment verification page

// payment page



