import { useEffect, useState } from "react"
import "./css/livechat.css"
import { getAuth } from "firebase/auth";
import { db as dbFirebase } from "../controller/firebaseApp";

import { Chat } from "../controller/live_chat_controller/models/chat";
import { getAllMessages, send_message, getTransactionById } from "../controller/live_chat_controller/live_chat_controller";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useParams } from "react-router-dom";

export const LiveChatPage = () => {
    const auth = getAuth();
    var uid = ""
    if(auth.currentUser != null){
        uid = auth.currentUser.uid;
    }
    const p =  useParams()
    const transactionId = p.id
    const [inputText, setInputText] = useState("")
    const [allMessages, setMessages] = useState([])
    const [currentImage, setCurrentImage] = useState(null)
    const [transaction, setTransaction] = useState(null)

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
            const result = await getAllMessages(transactionId)

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

    useEffect(() => {
        const getTransaction = async () => {
            
           const result = await getTransactionById(transactionId)
           console.log(result)
           setTransaction(result.data)
        }
        getTransaction()
        
    }, [])

    const uploadImage = async (event) => {
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
    
    return (uid !== "" && transaction != null ? (<div>

        {allMessages.map((dt) => dt.receiver_id !== uid ? (<div key={dt.date} class="containerLivechat">
           
            <img src="/w3images/bandmember.jpg" alt="Avatar" />
            {dt.type === "text" ? <p>{dt.sender_message}</p> : <img src={dt.sender_message} />} 
            <span class="time-right">{getMinutes(dt.date)} : {getSeconds(dt.date)}</span>
        </div>) : (<div key={dt.date}  class="containerLivechat darker">
            <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right" />
            {dt.type === "text" ? <p>{dt.sender_message}</p> : <img src={dt.sender_message} />} 
            <span class="time-left">{getMinutes(dt.date)} : {getSeconds(dt.date)}</span>
        </div>))}
        
        
        <input  type="file" onClick={uploadImage} />
        <input value={inputText} type="text" onChange={inputTextListener} />
        <button onClick={onClickBtn}>Send</button>
    </div>) : "Please login first")
}