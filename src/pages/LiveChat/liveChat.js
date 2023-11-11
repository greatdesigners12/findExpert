import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db as dbFirebase } from "../../controller/firebaseApp";

import { Chat } from "../../controller/live_chat_controller/models/chat";
import {
  getAllMessages,
  send_message,
  getTransactionById,
} from "../../controller/live_chat_controller/live_chat_controller";
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { getCurrentUser, getUserById } from "../../controller/auth_controller/auth_controller";
import { useContext } from "react";
import { UserContext } from "../../context/authContext";
import { ExpertsController } from "../../controller/experts_controller/experts_controller";

export const LiveChatPage = () => {
  const { userData, setUser } = useContext(UserContext);
  
  const p = useParams();
  const transactionId = p.id;
  const [inputText, setInputText] = useState("");
  const [allMessages, setMessages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [expertData, setExpertData] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const [senderRole, setUserRole] = useState(null)
  const {uid} = userData
  
  const inputTextListener = (event) => {
    setInputText(event.target.value);
  };

  useEffect(() => {
    if(userData != ""){
      setUserRole(userData.displayName)
    }
  }, [userData])

  const onClickBtn = async (event) => {
    var chat = null;
    
    const currentUser = uid;
    
    const target =
      transaction.expert_id === uid
        ? transaction.customer_id
        : transaction.expert_id;
    console.log(currentImage);
    if (currentImage !== null) {
      chat = new Chat(
        target,
        currentUser,
        currentImage,
        "images",
        transaction.id
      );
    } else {
      chat = new Chat(target, currentUser, inputText, "text", transaction.id);
    }

    const result = await send_message(chat);
    setCurrentImage(null);
  };

  useEffect(() => {
    
    const getAllMessage = async () => {
      const result = await getAllMessages(transactionId);
      console.log(result)

      if (result.statusCode === 200) {
        console.log(result.data)
        console.log(uid)
        setMessages(result.data);
      }
    };
    getAllMessage();
  }, []);

  useEffect(() => {
    const q = query(collection(dbFirebase, "livechat"),  where("transaction_id", "==", transactionId), orderBy("date"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const result = [];
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      });

      setMessages(result);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const getTransaction = async () => {
      const result = await getTransactionById(transactionId);
      setTransaction(result.data);
      
      const e = new ExpertsController()
      const expertDataTemp = await e.getExpertById(result.data.expert_id)
      setExpertData(expertDataTemp.data)
      const userInfo = await getUserById(result.data.customer_id)
      setUserInformation(userInfo.data)
      
    };
    getTransaction();
  }, []);

  

  const uploadImage = async (event) => {
    setCurrentImage(event.target.files[0]);

    var chat = null;
    const currentUser = uid;
    const target =
      transaction.expert_id === uid
        ? transaction.customer_id
        : transaction.expert_id;

    chat = new Chat(
      target,
      currentUser,
      currentImage,
      "images",
      transaction.id
    );

    const result = await send_message(chat);
    setCurrentImage(null);
    event.target.value = "";
  };


  const getMinutes = (date) => {
    const d = new Date(date.seconds * 1000);
    return d.getHours();
  };
  const getSeconds = (date) => {
    const d = new Date(date.seconds * 1000);
    return d.getMinutes();
  };

  return uid !== null && transaction != null && expertData != null && userData != null && senderRole != null ? (
    <div>
      <h1>You are chatting with {senderRole === "user" ? expertData.fullName : userData.fullName}</h1>
      {allMessages.map((dt) =>
        dt.receiver_id === uid ? (
          <div key={dt.date} class="containerLivechat">
            <img src={senderRole !== "user" ? expertData.profilePicture : ""} alt="Avatar" />
            {dt.type === "text" ? (
              <p>{dt.sender_message}</p>
            ) : (
              <img src={dt.sender_message} />
            )}
            <span class="time-right">
              {getMinutes(dt.date)} : {getSeconds(dt.date)}
            </span>
          </div>
        ) : (
          <div key={dt.date} class="containerLivechat darker">
            <img src={senderRole === "user" ? expertData.profilePicture : ""} alt="Avatar" class="right" />
            {dt.type === "text" ? (
              <p>{dt.sender_message}</p>
            ) : (
              <img src={dt.sender_message} />
            )}
            <span class="time-left">
              {getMinutes(dt.date)} : {getSeconds(dt.date)}
            </span>
          </div>
        )
      )}

      <div>
        <input type="file" onChange={uploadImage} />
        <input value={inputText} type="text" onChange={inputTextListener} />
        <button onClick={onClickBtn}>Send</button>
      </div>
    </div>
  ) : (
    "Please login first"
  );
};
