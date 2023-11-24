import AgoraUIKit from "agora-react-uikit";
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
  Timestamp,
} from "firebase/firestore";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  getCurrentUser,
  getUserById,
} from "../../controller/auth_controller/auth_controller";
import { useContext } from "react";
import { UserContext, getValidatedUser } from "../../context/authContext";
import { ExpertsController } from "../../controller/experts_controller/experts_controller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import CommonPageHeader from "../../components/CommonPageHeader/CommonPageHeader";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import {
  updateTransactionByExpert,
  updateTransactionStatusToOngoing,
} from "../../controller/transaction_controller/transaction_controller";
import { FaVideo } from "react-icons/fa";
import PageHelmet from "../../components/shared/PageHelmet";

export const LiveChatPage = () => {
  const [counter, setCounter] = useState(0);

  const { userData, setUser } = useContext(UserContext);

  const navigate = useNavigate();
  const p = useParams();
  const transactionId = p.id;
  const rtcProps = {
    appId: "9389c3640acc415295195dce74994e91",
    channel: transactionId,
    token: null,
    enableScreensharing: true,
  };
  const [inputText, setInputText] = useState("");
  const [allMessages, setMessages] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const [expertData, setExpertData] = useState(null);
  const [userInformation, setUserInformation] = useState(null);

  const [videoCall, setVideoCall] = useState(false);

  const callbacks = {
    EndCall: () => setVideoCall(false),
  };

  const [isLoadingMessages, setLoadingMessages] = useState(true);
  const [isLoadingReceiverData, setLoadingReceiverData] = useState(true);

  var uid = "";
  var senderRole = "";
  if (userData != "") {
    uid = userData.uid;
    senderRole = userData.displayName;
  }

  const inputTextListener = (event) => {
    setInputText(event.target.value);
  };
  const divRef = useRef(null);

  const onClickBtn = async (event) => {
    var chat = null;
    const currentUser = uid;
    const target =
      transaction.expert_id === uid
        ? transaction.customer_id
        : transaction.expert_id;

    chat = new Chat(target, currentUser, inputText, "text", transaction.id);
    setInputText("");
    const result = await send_message(chat);
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const onClickEndChat = async (event) => {
    setLoadingReceiverData(true);
    const endChat = await updateTransactionByExpert(transactionId, "done");

    navigate("/");
  };

  useEffect(() => {
    const getAllMessage = async () => {
      const result = await getAllMessages(transactionId);

      if (result.statusCode === 200) {
        console.log(result)
        setMessages(result.data);
        setLoadingMessages(false);
      }
    };
    getAllMessage();
  }, []);

  useEffect(() => {
    const updateStatusToDone = async () => {
      const updateStatusDone = await updateTransactionByExpert(
        transactionId,
        "done"
      );
      const result = await getTransactionById(transactionId);
      setTransaction(result.data);
    };

    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
      if (counter < 1) {
        setVideoCall(false);
        updateStatusToDone();
      }
    } else if (transaction != null) {
    }
  }, [counter]);

  useEffect(() => {
    const q = query(
      collection(dbFirebase, "livechat"),
      where("transaction_id", "==", transactionId),
      orderBy("date")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const result = [];
      querySnapshot.forEach((doc) => {
        const curData = doc.data()
        if(curData.date === null){
          curData.date = new Date()
        }
        result.push(curData);
      });
      console.log(result)
      setMessages(result);
      setLoadingMessages(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(
      collection(dbFirebase, "transactions"),
      where("id", "==", transactionId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      
      const result = [];
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      console.log(result)
      setTransaction(result[0]);
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
      const user = await getValidatedUser();
      
      setTransaction(result.data);
      if (userInfo.data.id != user.uid && expertDataTemp.data.id != user.uid) {
        
        navigate("/");
      } else if (
        result.data.transaction_status != "ongoing" &&
        result.data.transaction_status != "done"
      ) {
        const updateStatus = await updateTransactionStatusToOngoing(
          transactionId
        );

        

        
      }

      if (Timestamp.now() >= result.data.end_time) {
        const updateStatusDone = await updateTransactionByExpert(
          transactionId,
          "done"
        );

        const result = await getTransactionById(transactionId);
        setTransaction(result.data);
        
      } else {
        setCounter(result.data.end_time - Timestamp.now());
       
      }

      setLoadingReceiverData(false);
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

  if (expertData === null || isLoadingMessages || transaction === null) {
    return <LoadingSpinner />;
  } else {
    return videoCall ? (
      <div
        style={{ width: "100vw", height: "100vh" }}
        className="d-flex flex-column"
      >
        <h5 className="w-100 text-center">
          {"This Consultation Session Will End At " +
            Math.floor(counter / (60 * 60)) +
            ":" +
            Math.floor(counter / 60) +
            ":" +
            Math.floor(counter % 60)}
        </h5>
        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
      </div>
    ) : (
      <>
        <PageHelmet pageTitle="Live Chat" />
        <link rel="stylesheet" href="../../../../assets/css/livechat.css" />
        <script
          src="https://kit.fontawesome.com/240280eba1.js"
          crossOrigin="anonymous"
        ></script>
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
            {/* <img
              className="shape solid-square"
              src="../../assets/img/icon/slider/solid-square.png"
              alt="solid-square"
            /> */}
            <img
              className="shape circle-2"
              src="../../assets/img/icon/slider/circle.png"
              alt="circle"
            />
          </div>
          <div className="container p-relative">
            <div className="row">
              <div className="d-flex flex-row justify-content-evenly align-items-center">
                <div className="w-100"></div>
                <div className="d-flex flex-row justify-content-center w-100">
                  <p className="livechat-receivername fw-semibold mb-0 fs-5">
                    {senderRole === "user"
                      ? expertData.fullName
                      : userData.fullName}
                  </p>
                </div>
                <div className="d-flex fled-row justify-content-end w-100">
                  {transaction.transaction_status === "done" ? (
                    <></>
                  ) : (
                    <button
                      onClick={() => setVideoCall(true)}
                      className="btn btn-primary fw-medium me-3"
                    >
                      Join Video Call
                      <FaVideo className="ms-2" />
                    </button>
                  )}
                  {senderRole === "user" ? (
                    <></>
                  ) : (
                    <button
                      onClick={onClickEndChat}
                      className="btn btn-danger fw-medium"
                    >
                      End Chat
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="pt-4">
          <div className="px-4 mb-5">
            <div className="d-flex flex-row justify-content-center">
              <h5>
                {transaction.transaction_status === "ongoing"
                  ? "This Consultation Session Will End At " +
                    Math.floor(counter / (60 * 60)) +
                    ":" +
                    Math.floor((counter / 60) % 60) +
                    ":" +
                    (Math.floor(counter % 60) > 9
                      ? Math.floor(counter % 60)
                      : "0" + Math.floor(counter % 60))
                  : "This Consultation Session Ended At " +
                    new Date(transaction.end_time.seconds * 1000).getHours() +
                    ":" +
                    (new Date(
                      transaction.end_time.seconds * 1000
                    ).getMinutes() > 9
                      ? new Date(
                          transaction.end_time.seconds * 1000
                        ).getMinutes()
                      : "0" +
                        new Date(
                          transaction.end_time.seconds * 1000
                        ).getMinutes()) +
                    " " +
                    new Date(transaction.end_time.seconds * 1000).getDate() +
                    " " +
                    new Date(
                      transaction.end_time.seconds * 1000
                    ).toLocaleString("default", { month: "long" }) +
                    " " +
                    new Date(transaction.end_time.seconds * 1000).getFullYear()}
              </h5>
            </div>
            <div className="padding-chat">
              {allMessages.map((dt) =>
                dt.receiver_id === uid ? (
                  <div key={dt.date} className="d-flex flex-row">
                    <div className="containerLivechat d-flex flex-column w-100 px-4">
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
                      src={
                        senderRole === "user"
                          ? expertData.profilePicture
                          : "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png"
                      }
                      alt="Avatar"
                      className="chat-profile-picture ms-3 mt-2"
                    />
                  </div>
                ) : (
                  <div key={dt.date} className="d-flex flex-row">
                    <img
                      src={
                        senderRole !== "user"
                          ? expertData.profilePicture
                          : "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png"
                      }
                      alt="Avatar"
                      className="chat-profile-picture me-3 mt-2"
                    />
                    <div className="containerLivechat d-flex flex-column w-100 px-4">
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
              <div ref={divRef} />
            </div>
          </div>
          <div className="d-flex flex-row py-4 align-items-center px-5 send-msg-container mt-3">
            {transaction.transaction_status === "ongoing" ? (
              <>
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
              </>
            ) : (
              <h5 className="time-left w-100 text-center mb-0 fw-semibold">
                This Consultation Session Has Ended
              </h5>
            )}
          </div>
        </div>
      </>
    );
  }
};
