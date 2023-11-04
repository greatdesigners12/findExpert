import AgoraUIKit from "agora-react-uikit"
import { useEffect, useState } from 'react';
import { getAllExpertsData } from './controller/home_controller/home_controller';
import { TampilNamaWansen } from "./wansen";
import { TestingRegisterExpert } from "./testing backend/registerExpert";

export const HomePage = () => {
    const rtcProps = {
        appId: "9389c3640acc415295195dce74994e91",
        channel: "jack",
        token: null,
        enableScreensharing: true
      };
      const [wansenTidur, setWansenTidur] = useState(false)
      
      const [expertsData, setExpertsData] = useState([])
      const [videoCall, setVideoCall] = useState(false);
      const [isLoading, setLoading] = useState(true);

      const callbacks = {
        EndCall: () => setVideoCall(false),
      };
      

      useEffect(() => {
        const getData = async () => {
          const data = await getAllExpertsData();
          
          setExpertsData(data);
          setLoading(false);
        } 
        
        getData();
    
      }, []);
      // [{nama : wansen, age : 15}, {nama: micheila, age: 20}]

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
        <TampilNamaWansen />
        <TestingRegisterExpert />
       
      </div>)
}