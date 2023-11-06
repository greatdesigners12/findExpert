import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from './homepage';
import ExpertDetail from './expertDetail';
const router = createBrowserRouter([{
    path : "/", element : <HomePage/>,
    path : "/expertDetail", element : <ExpertDetail/>,
}])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    
      <App />
      
    
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
