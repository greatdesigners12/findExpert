import './App.css';
import { HomePage } from './pages/homepage/homepage';
import { useEffect } from 'react';
import { login, register } from './controller/auth_controller/auth_controller';
import { getAllTransactions, getAllUnverifiedWithdrawalRequest } from './controller/admin_controller/admin_controller';

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

export default App;
