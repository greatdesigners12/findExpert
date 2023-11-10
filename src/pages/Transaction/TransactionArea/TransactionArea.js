import React, { useState } from "react";
import { useEffect } from "react";
import { ExpertsController } from "../../../controller/experts_controller/experts_controller";
import { createTransaction } from "../../../controller/transaction_controller/transaction_controller";
import {Transaction} from "../../../controller/transaction_controller/models/transactions"
import { useParams } from "react-router-dom";
import "./transaction.css";
import { Link } from 'react-router-dom';

export const TransactionArea = () => {
  //   expert_id,
  //   customer_id,
  //   start_time,
  //   end_time,
  //   consultation_time,
  //   payment_amount,
  //   transaction_date,
  //   transaction_image,
  //   return_image
  const [expertsData, setExpertsData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profilePicture, updateProfilePicture] = useState(null)
  
  const params = useParams();
  const id = params.id;
  const timeIntervals = params.timeIntervals;

  useEffect(() => {
    const getData = async () => {
      const ec = new ExpertsController();
      const data = await ec.getExpertById(id);
      console.log(data);
      setExpertsData(data);
    };

    getData();
  }, []);

  const profilePictureInputHandler = (event) => {
    updateProfilePicture(event.target.files);
    console.log(event.target.files);
}

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    const data = new Transaction(expertsData.id, "40eqXaqMBLTeBs7tx0ygFFQB2Zc2","", "", 30, 65000, "2018-07-22", profilePicture, "")
    const result = await createTransaction(data)
    console.log(result);
}

  return (
    <div className="transaction-container">
      {expertsData == null ? (
        "Loading.."
      ) : (
        <form>
        <div className="transaction-content">
          <div className="left-side">
            <img src="../../assets/img/logo/Group119.png" alt="logo" />
            <img src="../../assets/img/logo/logo.png" alt="logo" />
          </div>
          <div className="right-side">
            <h1>BCA Account</h1>
            <h1>123456789</h1>
            {/* <h1 onChange={handlePriceChange} name="TotalPrices">{`Rp. ${expertsData.data.price * timeIntervals + 1000}`}</h1> */}
            <h5>Consultation Fee: Rp {expertsData.data.price}</h5>
            <h5>Service Fee: Rp 1.000</h5>
            <input type="file" name="profilePicture" onChange={profilePictureInputHandler} accept=".png,.jpg,.jpeg" />
            
            {/* <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="input-image"
              style={{ display: "none" }}
            />
            
            <label htmlFor="input-image" className="custom-file-upload">
              Upload Image
            </label>
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                style={{ maxWidth: "100px" }}
              />
            )} */}
            <li>
              <div className="address-button">
              <button onClick={onSubmitHandler}>Confirm</button>
              </div>
            </li>
          </div>
        </div>
        </form>
      )}
    </div>
  );
};

export default TransactionArea;
