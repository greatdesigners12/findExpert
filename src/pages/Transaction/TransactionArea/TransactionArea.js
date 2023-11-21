import React, { useContext,useState, useEffect } from "react";
import { ExpertsController } from "../../../controller/experts_controller/experts_controller";
import { createTransaction } from "../../../controller/transaction_controller/transaction_controller";
import { Transaction } from "../../../controller/transaction_controller/models/transactions";
import { useParams } from "react-router-dom";
import "./transaction.css";
import { UserContext } from "../../../context/authContext";
import { LoadingSpinner } from "../../../components/shared/LoadingSpinner";

export const TransactionArea = () => {
  const {userData, setUser} = useContext(UserContext);
  const [expertsData, setExpertsData] = useState(null);
  const params = useParams();
  const id = params.id;
  const timeIntervals = params.timeIntervals;
  const [invoicePicture, updateInvoicePicture] = useState(null);
  const [totalPrices, updateTotalPrices] = useState(null);
  const [expertStatus, updateStatus] = useState(null);
  const [confirmationDisabled, setConfirmationDisabled] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  
  useEffect(() => {
    const getData = async () => {
      const ec = new ExpertsController();
      const data = await ec.getExpertById(id);
      console.log(data);
      setExpertsData(data);
      const calculatedTotalPrices = data.data.price * timeIntervals + 1000;
      const getStatus = data.data.status;
      updateTotalPrices(calculatedTotalPrices);
      updateStatus(getStatus);
  
      // Check expert status here and disable confirmation if offline
      if (getStatus === "offline") {
        setConfirmationDisabled(true);
        setConfirmationMessage("Expert currently not available");
      } else {
        setConfirmationDisabled(false);
        setConfirmationMessage("");
      }
    };
  
    getData();
  }, [id, timeIntervals]);
  

  const totalPricesInputHandler = (event) => {
    const price = parseFloat(event.target.value);
    console.log(price);
    updateTotalPrices(isNaN(price) ? null : price);
  };

  const invoicePictureInputHandler = (event) => {
    updateInvoicePicture(event.target.files[0]);
    console.log(invoicePicture);
  };

  // ...

const onSubmitHandler = async (event) => {
  event.preventDefault();

  if (confirmationDisabled || expertStatus !== "online" || !invoicePicture) {
    // Jika kondisi tidak memenuhi persyaratan, tampilkan pesan dan hentikan fungsi
    setConfirmationMessage("Please submit an image before proceed");
    return;
  }

  // Mendapatkan tanggal saat ini
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const data = new Transaction(
    "",
    id,
    userData.uid,
    "",
    "",
    timeIntervals,
    totalPrices,
    formattedDate, // Menggunakan tanggal saat ini
    "",
    invoicePicture,
    "unverified"
  );

  const result = await createTransaction(data);
  console.log("total harga ", totalPrices);
  console.log(result);

  // Bersihkan pesan konfirmasi jika berhasil
  setConfirmationMessage("");

  window.location.href = "/";
};

// ...

return (
  <form>
    <div className="transaction-container">
      {expertsData == null ? (
        <LoadingSpinner/>
      ) : (
        <div className="transaction-content">
          <div className="left-side">
            <img src="../../assets/img/logo/Group119.png" alt="logo" />
            <img src="../../assets/img/logo/logo.png" alt="logo" />
          </div>
          <div className="right-side">
          <h1>BCA Account</h1>
              <h1>123456789</h1>
              <h1
                onChange={totalPricesInputHandler}
                name="totalPrices"
                value={`Rp. ${totalPrices}`}
              ></h1>
              <h3>Total Prices : Rp. {totalPrices}</h3>
              <h5>Consultation Duration : {timeIntervals*30} menit</h5>
              <h5>Consultation Fee : Rp {expertsData.data.price} / 30 menit</h5>
              <h5>Service Fee : Rp 1.000</h5>
            <input
              type="file"
              name="invoicePicture"
              onChange={invoicePictureInputHandler}
              accept=".png,.jpg,.jpeg"
            />
            {invoicePicture && (
              <img
                src={URL.createObjectURL(invoicePicture)}
                alt="Invoice Preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <li>
              <div className="address-button">
                <button className="z-btn" onClick={onSubmitHandler} disabled={confirmationDisabled}>
                  Confirm
                </button>
                {confirmationMessage && <p style={{ color: 'red' }}>{confirmationMessage}</p>}
              </div>
            </li>
          </div>
        </div>
      )}
    </div>
  </form>
);
};

export default TransactionArea;
