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
import { ExpertArea } from './pages/Experts/ExpertArea/ExpertArea';
import {ExpertDetailsArea} from './pages/ExpertDetails/ExpertDetailsArea/ExpertDetailsArea';
import { TransactionArea } from './pages/Transactions/TransactionArea/TransactionArea';

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
    element: <ExpertArea />,
  },
  {
    path: "/expertdetails/:id",
    element: <ExpertDetailsArea />
  },
  // {`/transaction/${expertsData.data.id}&${timeIntervals}`}
  {
    path: "/transaction/:id/:timeIntervals",
    element: <TransactionArea />
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
