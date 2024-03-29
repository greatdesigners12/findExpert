import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";
import "bootstrap/dist/js/bootstrap.min.js";
import AllContext from "./context/AllContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TestingRegisterExpert } from "./testing backend/registerExpert";
import { LiveChatPage } from "./pages/LiveChat/liveChat";
import { RegisterUser } from "./pages/Register/registerUser";
import { ServicesPages } from "./pages/Services/servicesPage";
import { Expert } from "./pages/Experts/Expert";
import { ExpertDetails } from "./pages/ExpertDetails/ExpertDetails";
import { ExpertByField } from "./pages/ExpertByFields/ExpertByField";
import Transaction from "./pages/Transaction/Transaction";
import { Login } from "./pages/Login/login";
import {
  IsAdmin,
  IsAuthenticated,
  IsExpert,
  IsNotAuthenticated,
  HomeCheckerForUser,
} from "./pages/Middleware/Middlewares";
import { UserContextProvider } from "./context/authContext";
import { RegisterExpert } from "./pages/Register/registerExpert";
import { TransactionList } from "./pages/Transaction/TransactionList";
import { HomeExpert } from "./pages/homepage/homeExpert";
import { HomeUser } from "./pages/homepage/homeUser";
import { AdminPage } from "./pages/Admin/admin.component";
import { LiveChatPageTesting } from "./testing backend/livechat";
import { WithdrawVerificationAdmin } from "./pages/Admin/withdrawVerificationAdmin";
import { TransactionAdmin } from "./pages/Admin/TransactionAdmin";
import { ExpertVerificationsAdmin } from "./pages/Admin/ExpertVerificationsAdmin";
import { PaymentVerificationAdmin } from "./pages/Admin/PaymentVerificationAdmin";

const router = createBrowserRouter([
  {
    path: "/livechatapp/",
    element: <App />,
  },
  {
    path: "/livechat/:id",
    element: (
      <IsAuthenticated>
        <LiveChatPage />
      </IsAuthenticated>
    ),
  },
  {
    path: "/register/expert",
    element: <TestingRegisterExpert />,
  },
  {
    path: "/register/",
    element: (
      <IsNotAuthenticated>
        <RegisterUser />
      </IsNotAuthenticated>
    ),
  },
  {
    path: "/testinglivechat/",
    element: <LiveChatPageTesting />,
  },
  {
    path: "/register-expert/",
    element: (
      <IsNotAuthenticated>
        <RegisterExpert />
      </IsNotAuthenticated>
    ),
  },
  {
    path: "/login/",
    element: (
      <IsNotAuthenticated>
        <Login />
      </IsNotAuthenticated>
    ),
  },
  {
    path: "/admin-transactions/",
    element: (
      <IsAuthenticated>
        <IsAdmin>
          <TransactionAdmin />
        </IsAdmin>
      </IsAuthenticated>
    ),
  },
  {
    path: "/admin-expert-verifications/",
    element: (
      <IsAuthenticated>
        <IsAdmin>
          <ExpertVerificationsAdmin />
        </IsAdmin>
      </IsAuthenticated>
    ),
  },
  {
    path: "/admin-withdraw-requests/",
    element: (
      <IsAuthenticated>
        <IsAdmin>
          <WithdrawVerificationAdmin />
        </IsAdmin>
      </IsAuthenticated>
    ),
  },
  {
    path: "/admin-payment-verifications/",
    element: (
      <IsAuthenticated>
        <IsAdmin>
          <PaymentVerificationAdmin />
        </IsAdmin>
      </IsAuthenticated>
    ),
  },
  {
    path: "/fields/",
    element: <ServicesPages />,
  },
  {
    path: "/transaction-list/",
    element: (
      <IsAuthenticated>
        <TransactionList />
      </IsAuthenticated>
    ),
  },

  // tidak dipakai, pakainya expertbyid
  {
    path: "/expert/",
    element: (
      <IsAuthenticated>
        <Expert />
      </IsAuthenticated>
    ),
  },
  {
    path: "/expertdetails/:id",
    element: <ExpertDetails />,
  },
  {
    path: "/transaction/:id/:timeIntervals",
    element: (
      <IsAuthenticated>
        <Transaction />
      </IsAuthenticated>
    ),
  },
  {
    path: "/expertbyfield/:id/:name",
    element: <ExpertByField />,
  },
  {
    path: "/homeexpert/",
    element: (
      <IsExpert>
        <HomeExpert />
      </IsExpert>
    ),
  },
  {
    path: "/",
    element: (
      <HomeCheckerForUser>
        <HomeUser />
      </HomeCheckerForUser>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//     <RouterProvider router={router} />
// );

root.render(
  <React.Fragment>
    <AllContext>
      <UserContextProvider>
        <RouterProvider router={router} />{" "}
      </UserContextProvider>
    </AllContext>{" "}
  </React.Fragment>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
