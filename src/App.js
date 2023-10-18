import logo from './logo.svg';
import './App.css';
import AgoraUIKit from "agora-react-uikit"
import { useState } from 'react';

function App() {
  const rtcProps = {
    appId: "9389c3640acc415295195dce74994e91",
    channel: "jack",
    token: null,
  };
  const [videoCall, setVideoCall] = useState(false);
  const callbacks = {
    EndCall: () => setVideoCall(false),
};
  return videoCall ? (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </div>
  ) : (
    <h3 onClick={() => setVideoCall(true)}>Join</h3>
  );
}

export default App;
