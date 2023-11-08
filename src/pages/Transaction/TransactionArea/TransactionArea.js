import React, { useState } from "react";
import { useEffect } from "react";
import { ExpertsController } from "../../../controller/experts_controller/experts_controller";
// import { TransactionController } from "../../../controller/transaction_controller/transaction_controller";
import { useParams } from "react-router-dom";
import "./transaction.css";
import { Link } from 'react-router-dom';

export const TransactionArea = () => {
  const [expertsData, setExpertsData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const params = useParams();
  const id = params.id;
  const timeIntervals = params.timeIntervals;
//   const tc = new TransactionController();

  useEffect(() => {
    const getData = async () => {
      const ec = new ExpertsController();
      const data = await ec.getExpertById(id);
      console.log(data);
      setExpertsData(data);
    };

    getData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  return (
    <div className="transaction-container">
      {expertsData == null ? (
        "Loading.."
      ) : (
        <div className="transaction-content">
          <div className="left-side">
            <img src="../../assets/img/logo/Group119.png" alt="logo" />
            <img src="../../assets/img/logo/logo.png" alt="logo" />
          </div>
          <div className="right-side">
            <h1>BCA Account</h1>
            <h1>123456789</h1>
            <h1>{`Rp. ${expertsData.data.price * timeIntervals + 1000}`}</h1>
            <h5>Consultation Fee: Rp {expertsData.data.price}</h5>
            <h5>Service Fee: Rp 1.000</h5>
            <input
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
            )}
            <li>
              <div className="address-button">
                <Link to={`/transaction/${expertsData.data.id}/${timeIntervals}`} className="z-btn">
                  Confirm
                </Link>
              </div>
            </li>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionArea;
