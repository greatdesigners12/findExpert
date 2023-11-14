import React from "react";
import Footer from "../../components/shared/Footer";
import PageHelmet from "../../components/shared/PageHelmet";
import StyleFiveHeader from "../Home/HeaderStyleFive/StyleFiveHeader";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useState } from "react";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import "./home.css";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/authContext.js";
import { useMemo } from "react";
import Pagination from "../../components/Pagination/Pagination";
import {
  createCashRequest,
  getAllCashRecords,
  getAllCashRecordsWithPagination,
} from "../../controller/cash_controller/cash_controller.js";
import { ExpertsController } from "../../controller/experts_controller/experts_controller.js";
import {
  getExpertByHistory,
  getExpertTransactionsById,
  getExpertTransactionsById2,
  updateTransactionByExpert,
  updateTransactionStatus,
} from "../../controller/transaction_controller/transaction_controller.js";

export const HomeExpert = () => {



  //withdraw cash
  const [accType, setaccType] = useState("");
  const [accNumber, setaccNumber] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { userData, setUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingTransaction, setLoadingTransactions] = useState(true);
  const [isLoadingTransactionsbyid, setLoadingTransactionsbyid] = useState(true);
  const [isLoadingTransactionsbyid2, setLoadingTransactionsbyid2] = useState(true);


  console.log(userData.uid);
  //for cash
  const [totalCash, setTotalCash] = useState(0);
  const [consultation, setConsultation] = useState([]);
  const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
  const [pageSizeTransactions, setPageSizeTransactions] = useState(1);
  const [currentPageTransactionsbyid, setCurrentPageTransactionsbyid] = useState(1);
  const [pageSizeTransactionsbyid, setPageSizeTransactionsbyid] = useState(1);
  const [currentPageTransactionsbyid2, setCurrentPageTransactionsbyid2] = useState(1);
  const [pageSizeTransactionsbyid2, setPageSizeTransactionsbyid2] = useState(1);
  //for transaction
  const [transactions, setTransactions] = useState([]);
  const [transactionsbyid, setTransactionsbyid] = useState([]);
  const [transactionsbyid2, setTransactionsbyid2] = useState([]);

  const currentTableDataTransactions = useMemo(() => {
    const firstPageIndex = (currentPageTransactions - 1) * pageSizeTransactions;
    const lastPageIndex = firstPageIndex + pageSizeTransactions;

    return transactions.slice(firstPageIndex, lastPageIndex);
  }, [currentPageTransactions, pageSizeTransactions]);

  const currentTableDataTransactionsbyid = useMemo(() => {
    const firstPageIndex = (currentPageTransactionsbyid - 1) * pageSizeTransactionsbyid;
    const lastPageIndex = firstPageIndex + pageSizeTransactionsbyid;

    return transactionsbyid.slice(firstPageIndex, lastPageIndex);
  }, [currentPageTransactionsbyid, pageSizeTransactionsbyid]);


const currentTableDataTransactionsbyid2 = useMemo(() => {
    const firstPageIndex = (currentPageTransactionsbyid2 - 1) * pageSizeTransactionsbyid2;
    const lastPageIndex = firstPageIndex + pageSizeTransactionsbyid2;

    return transactionsbyid2.slice(firstPageIndex, lastPageIndex);
  }, [currentPageTransactionsbyid2, pageSizeTransactionsbyid2]);

  const updateTransactionStatusAndNavigate = async (id) => {
    // Perform the updateTransactionStatus action here
    await updateTransactionStatus(id, true);

    // Navigate to another page after the action is performed
    navigate("/livechat/"+id);
  };

  useEffect(() => {
    const fetchTransactionsByID = async () => {
      // try {
      const expertId = userData.uid; // Replace with the actual expert ID
      const result = await getExpertTransactionsById(expertId, currentPageTransactionsbyid, pageSizeTransactionsbyid);
      if(result.statusCode == 200){
      setTransactionsbyid(result.data);
      setPageSizeTransactionsbyid(5);
      console.log(result.data);
      setLoadingTransactionsbyid(false);
      }
    };
    fetchTransactionsByID();
  }, []);

  useEffect(() => {
    const fetchTransactionsByID2 = async () => {
      // try {
      const expertId = userData.uid; // Replace with the actual expert ID
      const result = await getExpertTransactionsById2(expertId, currentPageTransactionsbyid2, pageSizeTransactionsbyid2);
      if(result.statusCode == 200){
      setTransactionsbyid2(result.data);
      setPageSizeTransactionsbyid2(5);
      console.log(result.data);
      setLoadingTransactionsbyid2(false);
      }
    };
    fetchTransactionsByID2();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      // try {
      const expertId = userData.uid; // Replace with the actual expert ID
      const result = await getAllCashRecords(expertId);
      setTransactions(result.data);
      setPageSizeTransactions(5);
      console.log(result);
      setLoadingTransactions(false);
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchTotalMoney = async () => {
      const ec = new ExpertsController();
      const expertId = userData.uid; // Replace with the actual expert ID
      const result = await ec.getExpertCashAmountById(expertId);
      setTotalCash(result.data);
      console.log(result.data);
    };
    fetchTotalMoney();
  }, []);

  useEffect(() => {
    const fetchConsultation = async () => {
      const expertId = userData.uid; // Replace with the actual expert ID
      const result = await getExpertTransactionsById(expertId);
      setConsultation(result.data);
      console.log(result.data);
      setLoadingTransactionsbyid(false);
    };
    fetchConsultation();
  }, []);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createCashRequest(
        userData.uid,
        totalCash,
        accNumber,
        accType
      );

      if (result.data != null) {
        sessionStorage.setItem("role", result.data.role);
        navigate("/");
      } else {
        console.log(result);
        setMessage(result.errorMessage);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <PageHelmet pageTitle="Home Expert" />
      <StyleFiveHeader />
      <section className="services__area home-expert-page pt-115 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-4">
              <div
                className="section__title section__title-3 text-center mb-90 wow fadeInUp "
                data-wow-delay=".2s"
              >
                <h3>
                  <span className="span">Expert</span>
                  <span className="text-wrapper-3">Pay</span>
                </h3>
                <h3>Rp. {totalCash}</h3>
                <form onSubmit={handleSubmit} className="w-75 mx-auto">
                  <div className="mb-3 mt-4">
                    <input
                      type="text"
                      className="form-control font-montserrat"
                      id="inputaccType"
                      name="accType"
                      placeholder="Enter Account Type"
                      value={accType}
                      onChange={(e) => setaccType(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 mt-4">
                    <input
                      type="number"
                      className="form-control font-montserrat"
                      id="inputaccNumber"
                      name="accNumber"
                      placeholder="Enter Account Number"
                      value={accNumber}
                      onChange={(e) => setaccNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex flex-column justify-content-center">
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-primary font-montserrat fw-semibold py-1 px-2"
                      >
                        <img
                          src="../assets/img/logo/Vector.png"
                          alt="logo"
                          className="p-3"
                        ></img>
                        <span className="white px-3">Cairkan Dana</span>
                      </button>
                    </div>
                    <small className="text-danger font-montserrat text-center mt-3">
                      {message}
                    </small>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-xl-1 col-lg-1"></div>
            <div className="col-xl-7 col-lg-7">
              <h3>Payment History</h3>
              <div
                className="section__title section__title-3 mb-90 wow fadeInUp"
                data-wow-delay=".2s"
              >
                <div className=" d-flex flex-column justify-content-center align-items-center">
                  {isLoadingTransaction ? (
                    <div className="py-5">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-start w-100">
                        <div className="d-flex flex-row align-items-center">
                          <p className="mb-0 me-3">Show </p>
                          <Form.Select
                            className="mb-3 mt-4"
                            value={pageSizeTransactions}
                            onChange={(e) => {
                              setPageSizeTransactions(e.target.value);
                            }}
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                          </Form.Select>
                          <p className="mb-0 ms-3">Entries</p>
                        </div>
                      </div>
                      <table className="table admin-table w-100">
                        <thead>
                          <tr>
                            <th scope="col" className="th-col">
                              Order ID
                            </th>
                            <th scope="col" className="th-col">
                              Date
                            </th>
                            <th scope="col" className="th-col">
                              Account Type
                            </th>
                            <th scope="col" className="th-col">
                              Account Number
                            </th>
                            <th scope="col" className="th-col">
                              Total
                            </th>
                            <th scope="col" className="th-col">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTableDataTransactions.map((transaction) => {
                            return (
                              <tr key={transaction.id}>
                                <th scope="row" className="th-row">
                                  {transaction.id}
                                </th>
                                <td>
                                  {new Date(
                                    transaction.withdraw_time.seconds
                                  ).toUTCString()}
                                </td>
                                <td>{transaction.account}</td>
                                <td>{transaction.no_rek}</td>
                                <td>{transaction.amount}</td>
                                <td
                                  style={{
                                    color:
                                      transaction.status === "verified"
                                        ? "green"
                                        : "red",
                                  }}
                                >
                                  {transaction.status}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <Pagination
                        className="pagination-bar"
                        currentPage={currentPageTransactions}
                        totalCount={transactions.length}
                        pageSize={pageSizeTransactions}
                        onPageChange={(page) =>
                          setCurrentPageTransactions(page)
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
           
              <div className="mb-3">
                <h3 className="mb-3">Consultation</h3>
                <div className="col-xl-3 col-lg-4 col-md-6">
                  
                  <div className="d-flex justify-content-start w-100">
                    <div className="d-flex flex-row align-items-center">

                      <p className="mb-0 me-3">Show </p>
                      <Form.Select
                        className="mb-3 mt-4"
                        value={pageSizeTransactionsbyid}
                        onChange={(e) => {
                          setCurrentPageTransactionsbyid(e.target.value);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                      </Form.Select>
                      <p className="mb-0 ms-3">Entries</p>
                    </div>
                  </div>
                </div>
                {transactionsbyid.length == 0 ? (
                    <div className="py-5">
                      <LoadingSpinner />
                    </div>
                  ) : (
                <div className="row mb-3">
                  {currentTableDataTransactionsbyid.map((transaction) => {
                    return (
                      <div className="col-xl-3 col-lg-3 col-md-3">
                        <div className="textdeco text-center mb-30">
                          <div className="team__thumb mb-25">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/400px-Siberischer_tiger_de_edit02.jpg"
                              alt="team"
                              className="w-75"
                            />

                            <div className="team__content">
                              <div key={transaction.id}>
                                <h3 className="m-2">
                                  {transaction.customer_id}
                                </h3>
                                {transaction.transaction_status ===
                                "on going" ? (
                                  <>
                                    <div
                                      style={{
                                        display: "inline-block",
                                        backgroundColor: "purple",
                                        borderRadius: "10px",
                                        padding: "5px",
                                        margin: "8px",
                                      }}
                                    >
                                      {transaction.transaction_status ===
                                        "on going" && (
                                        <span style={{ color: "white" }}>
                                          On Going
                                        </span>
                                      )}
                                    </div>
                                    <br></br>
                                    <button
                                      onClick={() =>
                                        updateTransactionStatusAndNavigate(
                                          transaction.id
                                        )
                                      }
                                      className="btn btn-danger"
                                    >
                                      Back to Livechat
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() =>
                                        updateTransactionStatusAndNavigate(
                                          transaction.id
                                        )
                                      }
                                      className="btn btn-success"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateTransactionStatus(
                                          transaction.id,
                                          false
                                        )
                                      }
                                      className="btn btn-danger ms-lg-2 mt-2 mt-lg-0"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}
                                {/* <span>{}</span> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                       
                    );
                    
                  })}
               
                </div>
)}
                <Pagination
                        className="pagination-bar"
                        currentPageTransactionsbyid={currentPageTransactionsbyid}
                        totalCount={transactionsbyid.length}
                        pageSize={pageSizeTransactionsbyid}
                        onPageChange={(page) =>
                          setCurrentPageTransactionsbyid(page)
                        }
                      />

              </div>

          </div>
          <div className="row my-3">
            
              <div>
                <h3>Consultation List</h3>
                <div className="col-xl-3 col-lg-4 col-md-6">
                  <div className="d-flex justify-content-start w-100">
                    <div className="d-flex flex-row align-items-center">
                      <p className="mb-0 me-3">Show </p>
                      <Form.Select
                        className="mb-3 mt-4"
                        value={pageSizeTransactionsbyid2}
                        onChange={(e) => {
                          setCurrentPageTransactionsbyid2(e.target.value);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                      </Form.Select>
                      <p className="mb-0 ms-3">Entries</p>
                    </div>
                  </div>
                </div>
                <div id="table-container"></div>
                {transactionsbyid2.length == 0 ? (
              <LoadingSpinner />
            ) : (
                <div class="records table-responsive">
                  <div>
                    <table width="100%">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th> Date</th>
                          <th> Jam</th>
                          <th> Billing Name</th>
                          <th>Total</th>
                          <th>Video Call</th>
                        </tr>
                      </thead>
                      <tbody>
                          {currentTableDataTransactionsbyid2.map((transaction2) => {
                            return (
                              <tr key={transaction2.id}>
                                <th scope="row" className="th-row">
                                  {transaction2.id}
                                </th>
                                <td>
                                {transaction2.transaction_date}
                                </td>
                                <td>{transaction2.start_time}-{transaction2.end_time}</td>
                                <td>{transaction2.customer_id}</td>
                                <td>{transaction2.payment_amount}</td>
                                <td
                                  
                                >
                                  <img src="../assets/img/Vector (1).png"
                          alt="logo"
                          className="p-3"></img>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                    </table>
                    <Pagination
                        className="pagination-bar"
                        currentPageTransactionsbyid={currentPageTransactionsbyid2}
                        totalCount={transactionsbyid2.length}
                        pageSize={pageSizeTransactionsbyid2}
                        onPageChange={(page) =>
                          setCurrentPageTransactionsbyid2(page)
                        }
                      />
                  </div>
                </div>
)}
              </div>
            
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
