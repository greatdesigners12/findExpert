import React from "react";
import Footer from "../../components/shared/Footer";
import PageHelmet from "../../components/shared/PageHelmet";
import StyleFiveHeader from "../Home/HeaderStyleFive/StyleFiveHeader";
import { login } from "../../controller/auth_controller/auth_controller";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useState } from "react";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import "./home.css";
import {
  getExpertTransactionsById
} from "../../controller/transaction_controller/transaction_controller";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/authContext.js";
import { useMemo } from "react";
import Pagination from "../../components/Pagination/Pagination";

export const HomeExpert = () => {
  //withdraw cash
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { userData, setUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);
  console.log(userData.uid);
  //for cash
  const [totalCash, setTotalCash] = useState(0);
  const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
  const [pageSizeTransactions, setPageSizeTransactions] = useState(1);
  //for transaction
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const currentTableDataTransactions = useMemo(() => {
    const firstPageIndex = (currentPageTransactions - 1) * pageSizeTransactions;
    const lastPageIndex = firstPageIndex + pageSizeTransactions;

    return transactions.slice(firstPageIndex, lastPageIndex);
  }, [currentPageTransactions, pageSizeTransactions]);

  useEffect(() => {
    const fetchTransactions = async () => {
      // try {
        const expertId = userData.uid; // Replace with the actual expert ID
        const result = await getExpertTransactionsById(expertId, currentPageTransactions, pageSizeTransactions);
          setTransactions(result.data);
          setPageSizeTransactions(5);
          console.log(result.data)
    }
    fetchTransactions();
  }, []);


  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

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
                        type="email"
                        className="form-control font-montserrat"
                        id="inputEmail"
                        name="email"
                        placeholder="Enter Account Type"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3 mt-4">
                      <input
                        type="password"
                        className="form-control font-montserrat"
                        id="inputPassword"
                        name="password"
                        placeholder="Enter Account Number"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      {transactions > 0 ? (
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
                          <table className="table admin-table w-25">
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
                                      <td>{transaction.transaction_date}</td>
                                      <td>{transaction.customer_id}</td>
                                      <td>{transaction.consultation_time}</td>
                                      <td>{transaction.payment_amount}</td>
                                      <td>{transaction.transaction_status}</td>
                                    </tr>
                                  );
                                })
                             }
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

            <div className="row">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div>
                  <h3>Consultation</h3>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="textdeco text-center mb-30">
                      <div className="team__thumb mb-25">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/400px-Siberischer_tiger_de_edit02.jpg"
                          alt="team"
                        />
                      </div>
                      <div className="team__content">
                        <h3>nnn</h3>
                        <span>mmm</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div>
                  <h3>Consultation List</h3>

                  <div id="table-container"></div>

                  <div class="records table-responsive">
                    <div>
                      <table width="100%">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th> NAMA</th>
                            <th> JAM KERJA</th>
                            <th> NO TELP</th>
                            <th>HAPUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>#0</td>
                            <td>nnn</td>
                            <td>nn</td>
                            <td>nnn</td>
                            <td>asasas</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </>
    );
};

