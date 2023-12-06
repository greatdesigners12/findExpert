import { useContext, useEffect, useState } from "react"
import { getAuth } from "firebase/auth";
import { db as dbFirebase } from "../controller/firebaseApp";
import AgoraUIKit from "agora-react-uikit";


import { Chat } from "../controller/live_chat_controller/models/chat";
import { getAllMessages, send_message, getTransactionById } from "../controller/live_chat_controller/live_chat_controller";
import { collection, query, onSnapshot, where, orderBy } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { getCurrentUser } from "../controller/auth_controller/auth_controller";
import { UserContext } from "../context/authContext";

export const LiveChatPageTesting = () => {
    const [videoCall, setVideoCall] = useState(false);
    const callbacks = {
        EndCall: () => setVideoCall(false),
      };
      
    const rtcProps = {
        appId: "9389c3640acc415295195dce74994e91",
        channel: "transaction_1699592443839",
        token: null,
        enableScreensharing: true,
      };
    const {userData, setUser} = useContext(UserContext)
    var uid = ""
    if(userData != ""){
        uid = userData.uid;
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

    // useEffect(() => {
       
    //     const q = query(collection(dbFirebase, "livechat"), where("transaction_id", "==", transactionId), orderBy("date"));
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         const result = [];
    //         querySnapshot.forEach((doc) => {
    //             result.push(doc.data())
    //         });

            
    //         setMessages(result)
    //     });
    //     return unsubscribe
    // }, [])

    useEffect(() => {
        const getTransaction = async () => {
            
           const result = await getTransactionById(transactionId)
           console.log(result)
           setTransaction(result.data)
        }
        getTransaction()
        
    }, [])

    const uploadImage = (event) => {
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
    
    return (videoCall ? (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
          <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      ) : (
        <h3 onClick={() => setVideoCall(true)}>Join</h3>
      ))
}
