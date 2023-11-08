import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import 'bootstrap/dist/js/bootstrap.min.js';
import AllContext from './context/AllContext';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { TestingRegisterExpert } from './testing backend/registerExpert';
import { LiveChatPage } from './testing backend/livechat';
import { RegisterUserPage } from './pages/register-user-page/register-user-page';
import { ServicesPages } from './pages/Services/servicesPage';
import { Expert } from './pages/Experts/Expert';
import { ExpertDetails } from './pages/ExpertDetails/ExpertDetails';
// import { TransactionArea } from './pages/Transactions/TransactionArea/TransactionArea';
import Transaction from './pages/Transaction/Transaction';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/livechat/:id",
    element: <LiveChatPage />
  },
  {
    path: "/register/expert",
    element: <TestingRegisterExpert />
  },
  {
    path: "/register/",
    element: <RegisterUserPage />,
  },
  {
    path: "/fields/",
    element: <ServicesPages />,
    
  },
  {
    path: "/expert/",
    element: <Expert />,
  },
  {
    path: "/expertdetails/:id",
    element: <ExpertDetails />
  },
  {
    path: "/transaction/:id/:timeIntervals",
    element: <Transaction />
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//     <RouterProvider router={router} />
// );

root.render(
  <React.Fragment>
    <AllContext>
    <RouterProvider router={router} />
    </AllContext>
  </React.Fragment>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();