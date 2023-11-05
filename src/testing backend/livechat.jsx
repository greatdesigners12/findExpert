import { useEffect, useState } from "react"
import "./css/livechat.css"
import { getAuth } from "firebase/auth";
import { db as dbFirebase } from "../controller/firebaseApp";

import { Chat } from "../controller/live_chat_controller/models/chat";
import { getAllMessages, send_message } from "../controller/live_chat_controller/live_chat_controller";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

export const LiveChatPage = ({transaction}) => {
    const auth = getAuth();
    var uid = ""
    if(auth.currentUser != null){
        uid = auth.currentUser.uid;
    }
    
    const [inputText, setInputText] = useState("")
    const [allMessages, setMessages] = useState([])
    const [currentImage, setCurrentImage] = useState(null)
    const inputTextListener = (event) => {
        setInputText(event.target.value)
    }
    const onClickBtn = async (event) => {
        var chat = null
        const currentUser = uid 
        const target = transaction.expert_id === uid ? transaction.customer_id : transaction.expert_id
        console.log(currentImage)
        if(currentImage !== null){
            chat = new Chat(target, currentUser, currentImage, "images", transaction.id)
        }else{

            chat = new Chat(target, currentUser, inputText, "text", transaction.id)
        }
        
        
        const result = await send_message(chat)
        setCurrentImage(null)
        console.log(result)
    }

    useEffect(() => {
        const getAllMessage = async () => {
            const result = await getAllMessages(transaction.id)

            if(result.statusCode === 200 ){
                setMessages(result.data)
            }
        }
        getAllMessage()    
    }, [])

    useEffect(() => {
        const q = query(collection(dbFirebase, "livechat"), orderBy("date"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
                result.push(doc.data())
            });

            
            setMessages(result)
        });
        return unsubscribe
    }, [])

    const uploadImage = async (event) => {
        console.log(event.target.files)
        
        setCurrentImage(event.target.files[0])
            
            
        
    }

    const getMinutes = (date) => {
        const d = new Date(date.seconds*1000)
        return d.getHours()
    }
    const getSeconds = (date) => {
        const d = new Date(date.seconds*1000)
        return d.getMinutes()
    }
    
    return (uid !== "" ? (<div>

        {allMessages.map((dt) => dt.receiver_id !== uid ? (<div class="container">
            {console.log(dt)}
            <img src="/w3images/bandmember.jpg" alt="Avatar" />
            {dt.type === "text" ? <p>{dt.sender_message}</p> : <img src={dt.sender_message} />} 
            <span class="time-right">{getMinutes(dt.date)} : {getSeconds(dt.date)}</span>
        </div>) : (<div class="container darker">
            <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right" />
            {dt.type === "text" ? <p>{dt.sender_message}</p> : <img src={dt.sender_message} />} 
            <span class="time-left">{getMinutes(dt.date)} : {getSeconds(dt.date)}</span>
        </div>))}
        
        
        <input  type="file" onClick={uploadImage} />
        <input value={inputText} type="text" onChange={inputTextListener} />
        <button onClick={onClickBtn}>Send</button>
    </div>) : "Please login first")
}