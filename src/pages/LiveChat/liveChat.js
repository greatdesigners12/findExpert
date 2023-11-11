import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db as dbFirebase } from "../../controller/firebaseApp";

import { Chat } from "../../controller/live_chat_controller/models/chat";
import {
  getAllMessages,
  send_message,
  getTransactionById,
} from "../../controller/live_chat_controller/live_chat_controller";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import {
  getCurrentUser,
  getUserById,
} from "../../controller/auth_controller/auth_controller";
import { useContext } from "react";
import { UserContext } from "../../context/authContext";
import { ExpertsController } from "../../controller/experts_controller/experts_controller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import CommonPageHeader from "../../components/CommonPageHeader/CommonPageHeader";

export const LiveChatPage = () => {
  const { userData, setUser } = useContext(UserContext);

  const p = useParams();
  const transactionId = p.id;
  const [inputText, setInputText] = useState("");
  const [allMessages, setMessages] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const [expertData, setExpertData] = useState(null);
  const [userInformation, setUserInformation] = useState(null);

  var uid = "";
  var senderRole = "";
  if (userData != "") {
    uid = userData.uid;
    senderRole = userData.displayName;
  }
  const inputTextListener = (event) => {
    setInputText(event.target.value);
  };
  const onClickBtn = async (event) => {
    var chat = null;
    const currentUser = uid;
    const target =
      transaction.expert_id === uid
        ? transaction.customer_id
        : transaction.expert_id;

    chat = new Chat(target, currentUser, inputText, "text", transaction.id);

    const result = await send_message(chat);
  };

  useEffect(() => {
    const getAllMessage = async () => {
      const result = await getAllMessages(transactionId);
      console.log(result);
      if (result.statusCode === 200) {
        setMessages(result.data);
      }
    };
    getAllMessage();
  }, []);

  useEffect(() => {
    const q = query(
      collection(dbFirebase, "livechat"),
      where("transaction_id", "==", transactionId),
      orderBy("date")
    );
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

      const e = new ExpertsController();
      const expertDataTemp = await e.getExpertById(result.data.expert_id);
      setExpertData(expertDataTemp.data);
      const userInfo = await getUserById(result.data.customer_id);
      setUserInformation(userInfo.data);
    };
    getTransaction();
  }, []);

  const uploadImage = async (event) => {
    var chat = null;
    const currentUser = uid;
    const target =
      transaction.expert_id === uid
        ? transaction.customer_id
        : transaction.expert_id;

    chat = new Chat(
      target,
      currentUser,
      event.target.files[0],
      "images",
      transaction.id
    );

    const result = await send_message(chat);
    event.target.value = "";
  };

  console.log(getCurrentUser());
  const getMinutes = (date) => {
    const d = new Date(date.seconds * 1000);
    return d.getHours();
  };
  const getSeconds = (date) => {
    const d = new Date(date.seconds * 1000);
    return d.getMinutes();
  };

  const imageRef = useRef();

  const paperclipClick = (e) => {
    var inputField = imageRef;
    inputField.current.click();
  };

  return uid !== "" && transaction != null ? (
    <>
      <section
        className="page__title p-relative d-flex align-items-center fix livechat-navbar"
        style={{
          background: `url(../../../assets/img/page-title/page-title-1.jpg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="slider__shape">
          <img
            className="shape triangle"
            src="../../assets/img/icon/slider/triangle.png"
            alt="triangle"
          />
          <img
            className="shape dotted-square"
            src="../../assets/img/icon/slider/dotted-square.png"
            alt="dotted-square"
          />
          <img
            className="shape solid-square"
            src="../../assets/img/icon/slider/solid-square.png"
            alt="solid-square"
          />
          <img
            className="shape circle-2"
            src="../../assets/img/icon/slider/circle.png"
            alt="circle"
          />
        </div>
        <div className="container p-relative">
          <div className="row">
            <div className="">
              <p>
                {senderRole === "user"
                  ? expertData.fullName
                  : userData.fullName}
              </p>
            </div>
          </div>
        </div>
      </section>
      <link rel="stylesheet" href="../../../../assets/css/livechat.css" />
      <script
        src="https://kit.fontawesome.com/240280eba1.js"
        crossorigin="anonymous"
      ></script>
      <div className="pt-4">
        <div className="px-4">
          {allMessages.map((dt) =>
            dt.receiver_id !== uid ? (
              <div key={dt.date} className="d-flex flex-row">
                <div className="containerLivechat d-flex flex-column w-100">
                  <div className="d-flex flex-row w-100 justify-content-end">
                    {dt.type === "text" ? (
                      <p className="fw-medium">{dt.sender_message}</p>
                    ) : (
                      <img src={dt.sender_message} className="sent-img" />
                    )}
                  </div>
                  <span className="time-left">
                    {getMinutes(dt.date)} :{" "}
                    {getSeconds(dt.date) > 9
                      ? getSeconds(dt.date)
                      : "0" + getSeconds(dt.date)}
                  </span>
                </div>
                <img
                  src="https://www.pacegallery.com/media/images/heroimage.width-2000.webp"
                  alt="Avatar"
                  className="chat-profile-picture ms-3 mt-2"
                />
              </div>
            ) : (
              <div key={dt.date} className="d-flex flex-row">
                <img
                  src="https://www.pacegallery.com/media/images/heroimage.width-2000.webp"
                  alt="Avatar"
                  className="chat-profile-picture me-3 mt-2"
                />
                <div className="containerLivechat d-flex flex-column w-100">
                  <div className="d-flex flex-row w-100 justify-content-start">
                    {dt.type === "text" ? (
                      <p className="fw-medium">{dt.sender_message}</p>
                    ) : (
                      <img src={dt.sender_message} className="sent-img" />
                    )}
                  </div>
                  <div className="d-flex flex-row justify-content-end">
                    <span className="time-right">
                      {getMinutes(dt.date)} :{" "}
                      {getSeconds(dt.date) > 9
                        ? getSeconds(dt.date)
                        : "0" + getSeconds(dt.date)}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        <div className="d-flex flex-row py-4 align-items-center px-5 send-msg-container mt-3">
          <FontAwesomeIcon
            icon={faPaperclip}
            size="xl"
            onClick={paperclipClick}
            className="clipButton"
          />
          <input
            ref={imageRef}
            type="file"
            onChange={uploadImage}
            className="d-none"
          />
          <input
            value={inputText}
            type="text"
            onChange={inputTextListener}
            className="form-control ms-3"
          />
          <button onClick={onClickBtn} className="btn fw-bold">
            Send
          </button>
        </div>
      </div>
    </>
  ) : (
    "Please login first"
  );
};
