import AgoraUIKit from "agora-react-uikit"
import { useEffect, useState } from 'react';
import { getAllExpertsData } from '../../controller/home_controller/home_controller';
import { TestingRegisterExpert } from "../../testing backend/registerExpert";
import { LiveChatPage } from "../../testing backend/livechat";
import { Transaction } from "../../controller/transaction_controller/models/transactions";
import { Link } from "react-router-dom";
import { getCurrentUser, logout } from "../../controller/auth_controller/auth_controller";
export const HomePage = () => {
    const rtcProps = {
        appId: "9389c3640acc415295195dce74994e91",
        channel: "jack",
        token: null,
        enableScreensharing: true
      };
      const currentDate = new Date()
      const transaction = new Transaction("DqAL9H3PaY411pi7AWxd", "50zreHcLmQcVNQUAXbWuIjDkWj63", "jzBPUODvTOXUnsJHE0PoVGEfHG12", currentDate, currentDate.setTime(currentDate.getTime() + (30 * 60 * 1000)), 30*60*1000, 100000, currentDate, "verified", "gg.jpg", "gg.jpg")
      const [expertsData, setExpertsData] = useState([])
      const [videoCall, setVideoCall] = useState(false);
      const [isLoading, setLoading] = useState(true);

        

      const callbacks = {
        EndCall: () => setVideoCall(false),
      };

      const logOutHandler = async () => {
        const data = await logout()
        console.log(data)
      }
      

      useEffect(() => {
        const getData = async () => {
          const data = await getAllExpertsData();
          
          setExpertsData(data);
          setLoading(false);
        } 
        
        getData();
    
      }, []);

    return (<div>
        {videoCall ? (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
          <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      ) : (
        <h3 onClick={() => setVideoCall(true)}>Join</h3>
      )}
      
        {isLoading ? "Loading..." : expertsData.map((expert) => (<div>
          <h2>Halo</h2>
            <h1>{expert.name}</h1>
          </div>))}
       
        <button style={{whiteSpace: "pre-line"}}><Link to="register/expert">Ke halaman register expert</Link></button>
        <button style={{whiteSpace: "pre-line"}} onClick={logOutHandler}> logout</button>
        <button style={{whiteSpace: "pre-line"}}><Link to={`livechat/transaction_1699592443838`}>Ke halaman live chat</Link></button>
        
      </div>)
}