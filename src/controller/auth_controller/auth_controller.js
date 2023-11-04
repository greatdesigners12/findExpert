import { db, app } from "../firebaseApp";
import { collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ResultData } from "../structureJson/resultData";
import {UserData} from "./models/userData"
export async function login (email, password)  {
    const auth = getAuth();
    const result = new ResultData();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/

    var errorMsgValidation = "";

    if(!email.match(emailRegex)){
        errorMsgValidation = "Email"
    }

    if(!password.match(passwordRegex)){
        if(password === ""){
            errorMsgValidation = "Password"
        }else{
            errorMsgValidation = " and Password"
        }
        
    }
    

    if(errorMsgValidation !== ""){
        errorMsgValidation += " format is not corrent"
        if(errorMsgValidation.includes("Password")){
            errorMsgValidation += " (For password, please input atleast at least one uppercase letter, one lowercase letter and one number)"
        }
        result.data = null;
        result.errorMessage = errorMsgValidation;
        result.statusCode = 400;
        return result;
    }

    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        result.data = userCredential.user;
        result.errorMessage = "";
        result.statusCode = 200;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        result.data = null;
        result.errorMessage = errorMessage;
        result.statusCode = errorCode;
    });

    return result;

}

export async function register (email, password, confirmPassword)  {
    const result = new ResultData()

    if(password != confirmPassword){
        result.data = null;
        result.errorMessage = "The password doesn't match";
        result.statusCode = 400;
        return result
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/

    var errorMsgValidation = "";

    if(!email.match(emailRegex)){
        errorMsgValidation = "Email"
    }
    
    if(!password.match(passwordRegex)){
        if(errorMsgValidation === ""){
            errorMsgValidation += "Password"
        }else{
            errorMsgValidation += " and Password"
        }
        
    }
    

    if(errorMsgValidation !== ""){
        errorMsgValidation += " format is not corrent"
        if(errorMsgValidation.includes("Password")){
            errorMsgValidation += " (For password, please input atleast at least one uppercase letter, one lowercase letter and one number)"
        }
        result.data = null;
        result.errorMessage = errorMsgValidation;
        result.statusCode = 400;
        return result;
    }


    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        
        result.data = userCredential.user;
        result.errorMessage = "";
        result.statusCode = 200;
        
        
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        result.data = errorCode;
        result.errorMessage = errorMessage;
        result.statusCode = 400;
        
    });

    if(result.statusCode === 200){
        const data = new UserData(result.data.uid, "", "").serialize()
        await setDoc(doc(db, "userData", result.data.uid), data);
    }
    
    return result;

}