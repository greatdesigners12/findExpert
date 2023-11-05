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
import Expert from './src/controller/expert_controller/models/expert';
import Transaction from './src/controller/transaction_controller/models/transactions';



import { useEffect } from 'react';
import { login, register } from './controller/auth_controller/auth_controller';
import { getAllTransactions, getAllUnverifiedWithdrawalRequest } from './controller/admin_controller/admin_controller';


const expertRef = new Expert(); // Initialize with the appropriate reference
const transactionRef = new Transaction(); // Initialize with the appropriate reference

function App() {
  useEffect(() => {
    const tryLogin = async () => {
      // test akun user : "gg@gmail.com", "Awd123"
      // test akun expert : "ggbrooo@gmail.com ", "GGWP123awda"
      const data =  await login("gg@gmail.com", "Awd123");
      const result1 =  await getAllTransactions(1, 5)
      const result2 =  await getAllUnverifiedWithdrawalRequest(1, 5)
    
      console.log(result1)
      console.log(result2)
      
      
    }
    tryLogin();
  }, [])
  return <HomePage/>;
}

function hasNetwork(online) {
  const element = document.querySelector(".status");

  if (online) {
    element.classList.remove("offline");
    element.classList.add("online");

    // Retrieve expert data and transactions data
    const expertData = expertRef.getExpertData(); // Use the appropriate method to get expert data
    const transactions = transactionRef.getAllTransactions(); // Use the appropriate method to get transactions

    const hasOngoingOrReadyTransactions = transactions.some(
      (transaction) =>
        transaction.transaction_status === "ongoing" ||
        transaction.transaction_status === "ready"
    );

    if (hasOngoingOrReadyTransactions) {
      expertData.status = "busy";
    } else {
      expertData.status = "online";
    }
  } else {
    element.classList.remove("online");
    element.classList.add("offline");
    expertData.status = "offline";
  }
}

// Initial call when the page loads
window.addEventListener("load", () => {
  hasNetwork(navigator.onLine);
});

// Listen for online/offline events
window.addEventListener("online", () => {
  hasNetwork(true);
});

window.addEventListener("offline", () => {
  hasNetwork(false);
});


export default App;
