import logo from './logo.svg';
import './App.css';
import { HomePage } from './homepage';
import { OtherPage } from './otherPage';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";


import { useEffect } from 'react';
import { login, register } from './controller/auth_controller/auth_controller';

function App() {
  // useEffect(() => {
  //   const tryLogin = async () => {
  //     const data =  await getAllExpertsData("gg", "Awd123");
  //     console.log(data);
  //   }
  //   tryLogin();
  // }, [])
  return <HomePage/>;
}

export default App;
