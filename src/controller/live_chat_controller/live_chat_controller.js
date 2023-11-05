import { db, app } from "../firebaseApp";
import {collection, addDoc, getDocs, orderBy, query, where} from "firebase/firestore"; 
import { ResultData } from "../structureJson/resultData";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function getAllMessages(id_transaction){
    const result = new ResultData();
    
    
    try{
        const allMessages = []
        const querySnapshot = await getDocs(query(collection(db, "livechat"), where("transaction_id", "==", id_transaction), orderBy("date")));
        
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            allMessages.push(doc.data())
        });
        result.data = allMessages
        result.statusCode = 200
        result.errorMessage = null
        
        
    }catch(e){
        result.data = null
        result.statusCode = 400
        result.errorMessage = e.message
    }
    return result
}

export async function send_message(chat){
    const result = new ResultData();
    try{
        var r = null
        if(chat.type === "text"){
            r = await addDoc(collection(db, "livechat"), chat.serialize());
        }else{
            const storage = getStorage();
            const imageName = 'message_images/' + new Date().getTime() + ".png"
            const storageRef = ref(storage, imageName);

            
            // 'file' comes from the Blob or File API
            await uploadBytes(storageRef, chat.sender_message).then(async (snapshot) => {
                
                
                await getDownloadURL(snapshot.ref).then((downloadURL) => {
                    chat.sender_message = downloadURL
                  });
                r = await addDoc(collection(db, "livechat"), chat.serialize());
              
            });
        }
        result.data = r
        result.statusCode = 200
        result.errorMessage = null
    }catch(e){
        result.data = null
        result.statusCode = 400
        result.errorMessage = e.message
    }
    return result
}