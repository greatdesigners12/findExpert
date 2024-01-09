import { useState } from "react";
import {
  getAllTransactions,
  getAllUnverifiedExperts,
  getAllUnverifiedTransactions,
  getAllUnverifiedWithdrawalRequest,
  getTotalEquity,
  getTotalNumberConsultans,
  getTotalNumberTransactions,
  updateExpertStatus,
  updateTransactionStatus,
  updateTransactionWithdrawStatus,
} from "../../controller/admin_controller/admin_controller";
import { useEffect } from "react";
import PageHelmet from "../../components/shared/PageHelmet";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import Pagination from "../../components/Pagination/Pagination";
import { Form } from "react-bootstrap";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

export const AdminPage = () => {
  const [equity, setEquity] = useState("");
  const [transactionCount, setTransactionCount] = useState(0);
  const [consultantCount, setConsultantCount] = useState(0);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [expertVerifications, setExpertVerifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [paymentVerifications, setPaymentVerfications] = useState([]);

  const [isLoadingPaymentVerifications, setIsLoadingPaymentVerifications] =
    useState(true);
  const [currentPagePaymentVerifications, setCurrentPagePaymentVerifications] =
    useState(1);
  const [pageSizePaymentVerifications, setPageSizePaymentVerifications] =
    useState(0);

  const currentTableDataPaymentVerifications = useMemo(() => {
    const firstPageIndex =
      (currentPagePaymentVerifications - 1) * pageSizePaymentVerifications;
    const lastPageIndex = firstPageIndex + pageSizePaymentVerifications;

    return paymentVerifications.slice(firstPageIndex, lastPageIndex);
  }, [currentPagePaymentVerifications, pageSizePaymentVerifications]);

  const [isLoadingWithdrawRequests, setIsLoadingWithdrawRequests] =
    useState(true);
  const [currentPageWithdrawRequests, setCurrentPageWithdrawRequests] =
    useState(1);
  const [pageSizeWithdrawRequests, setPageSizeWithdrawRequests] = useState(0);

  const currentTableDataWithdrawRequests = useMemo(() => {
    const firstPageIndex =
      (currentPageWithdrawRequests - 1) * pageSizeWithdrawRequests;
    const lastPageIndex = firstPageIndex + pageSizeWithdrawRequests;
    console.log(withdrawRequests.length);

    return withdrawRequests.slice(firstPageIndex, lastPageIndex);
  }, [currentPageWithdrawRequests, pageSizeWithdrawRequests]);

  const [isLoadingExpertVerifications, setIsLoadingExpertVerifications] =
    useState(true);
  const [currentPageExpertVerifications, setCurrentPageExpertVerifications] =
    useState(1);
  const [pageSizeExpertVerifications, setPageSizeExpertVerifications] =
    useState(0);

  const currentTableDataExpertVerifications = useMemo(() => {
    const firstPageIndex =
      (currentPageExpertVerifications - 1) * pageSizeExpertVerifications;
    const lastPageIndex = firstPageIndex + pageSizeExpertVerifications;

    return expertVerifications.slice(firstPageIndex, lastPageIndex);
  }, [currentPageExpertVerifications, pageSizeExpertVerifications]);

  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
  const [pageSizeTransactions, setPageSizeTransactions] = useState(0);

  const currentTableDataTransactions = useMemo(() => {
    const firstPageIndex = (currentPageTransactions - 1) * pageSizeTransactions;
    const lastPageIndex = firstPageIndex + pageSizeTransactions;

    return transactions.slice(firstPageIndex, lastPageIndex);
  }, [currentPageTransactions, pageSizeTransactions]);

  function currencyFormat(num) {
    return "Rp. " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const getEquityTransactionsConsultants = async () => {
      const result1 = await getTotalEquity();
      const result2 = await getTotalNumberTransactions();
      const result3 = await getTotalNumberConsultans();

      if (result1.statusCode === 200) {
        setEquity(currencyFormat(result1.data));
      }

      if (result2.statusCode === 200) {
        setTransactionCount(result2.data);
      }

      if (result3.statusCode === 200) {
        setConsultantCount(result3.data);
      }
    };

    getEquityTransactionsConsultants();
  }, []);

  useEffect(() => {
    const getWithdrawRequests = async () => {
      const result = await getAllUnverifiedWithdrawalRequest();

      setTimeout(function () {
        setWithdrawRequests(result.data);
        setPageSizeWithdrawRequests(5);
        setIsLoadingWithdrawRequests(false);
      }, 2000);
    };

    getWithdrawRequests();
  }, []);

  useEffect(() => {
    const getExpertVerifications = async () => {
      const result = await getAllUnverifiedExperts();

      setTimeout(function () {
        setExpertVerifications(result.data);
        setPageSizeExpertVerifications(5);
        setIsLoadingExpertVerifications(false);
      }, 2000);
    };

    getExpertVerifications();
  }, []);

  useEffect(() => {
    const getAllTransaction = async () => {
      const result = await getAllTransactions(1);

      setTimeout(function () {
        setTransactions(result.data);
        setPageSizeTransactions(5);
        setIsLoadingTransactions(false);
      }, 2000);
    };

    getAllTransaction();
  }, []);

  useEffect(() => {
    const getPaymentVerifications = async () => {
      var result = await getAllUnverifiedTransactions();
      setTimeout(function () {
        result.data = result.data.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.transaction_date) - new Date(a.transaction_date);
        });
        setPaymentVerfications(result.data);
        setPageSizePaymentVerifications(5);
        setIsLoadingPaymentVerifications(false);
      }, 2000);
    };

    getPaymentVerifications();
  }, []);

  return (
    <div className="admin-page-bg">
      <PageHelmet pageTitle="Admin Panel" />
      <link rel="stylesheet" href="../../../../assets/css/admin.css" />
      <div className="admin-navbar w-100 justify-content-between d-flex">
        <div className="align-items-center admin-navbar-logo-container h-100 px-5">
          <img
            src="assets/img/logo/logo-white.png"
            className="admin-logo"
            alt=""
          />
        </div>
        <NavLink onClick={handleLogout} className="z-btn z-btn-white">
          Logout
        </NavLink>
      </div>
      <div className="container py-5">
        <div className="row d-flex flex-row justify-content-evenly">
          <div className="col-lg-4 col-12">
            <div className="admin-info-card px-5 py-4">
              <h2 className="font-frankruhllibre">Equity</h2>
              <h3 className="font-montserrat color-purple mt-2">{equity}</h3>
            </div>
          </div>
          <div className="col-lg-4 col-12 my-4 my-lg-0">
            <div className="admin-info-card px-5 py-4">
              <h2 className="font-frankruhllibre">Transactions</h2>
              <h3 className="font-montserrat color-purple mt-2">
                {transactionCount}
              </h3>
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <div className="admin-info-card px-5 py-4">
              <h2 className="font-frankruhllibre">Consultants</h2>
              <h3 className="font-montserrat color-purple mt-2">
                {consultantCount}
              </h3>
            </div>
          </div>
        </div>
        <div className="pt-5 d-flex flex-column justify-content-center align-items-center">
          <h2 className="font-frankruhllibre w-100 mb-3">
            Withdrawal Requests
          </h2>
          {isLoadingWithdrawRequests ? (
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
                    value={pageSizeWithdrawRequests}
                    onChange={(e) => {
                      setPageSizeWithdrawRequests(e.target.value);
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
                      ID
                    </th>
                    <th scope="col" className="th-col">
                      Date
                    </th>
                    <th scope="col" className="th-col">
                      Bank
                    </th>
                    <th scope="col" className="th-col">
                      Account No
                    </th>
                    <th scope="col" className="th-col">
                      Expert ID
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
                  {currentTableDataWithdrawRequests.map((cash) => (
                    <tr key={cash.id}>
                      <th scope="row" className="th-row">
                        {cash.id}
                      </th>
                      <td>
                        {new Date(cash.withdraw_time.seconds).toUTCString()}
                      </td>
                      <td>{cash.account}</td>
                      <td>{cash.no_rek}</td>
                      <td>{cash.expertData.fullName}</td>
                      <td>{cash.amount}</td>
                      <td>
                        <div>
                          <button
                            onClick={() =>
                              updateTransactionWithdrawStatus(cash.id, true)
                            }
                            className="btn btn-success"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateTransactionWithdrawStatus(cash.id, false)
                            }
                            className="btn btn-danger ms-lg-2 mt-2 mt-lg-0"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                className="pagination-bar"
                currentPage={currentPageWithdrawRequests}
                totalCount={withdrawRequests.length}
                pageSize={pageSizeWithdrawRequests}
                onPageChange={(page) => setCurrentPageWithdrawRequests(page)}
              />
            </>
          )}
        </div>
        <div className="pt-5 d-flex flex-column justify-content-center align-items-center">
          <h2 className="font-frankruhllibre w-100 mb-3">
            Expert Verifications
          </h2>
          {isLoadingExpertVerifications ? (
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
                    value={pageSizeExpertVerifications}
                    onChange={(e) => {
                      setPageSizeExpertVerifications(e.target.value);
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
                      ID
                    </th>
                    <th scope="col" className="th-col">
                      Full Name
                    </th>
                    <th scope="col" className="th-col">
                      Email
                    </th>
                    <th scope="col" className="th-col">
                      Field
                    </th>
                    <th scope="col" className="th-col">
                      Phone Number
                    </th>
                    <th scope="col" className="th-col">
                      More Information
                    </th>
                    <th scope="col" className="th-col">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableDataExpertVerifications.map((expert) => (
                    <tr key={expert.id}>
                      <th scope="row" className="th-row">
                        {expert.id}
                      </th>
                      <td>{expert.fullName}</td>
                      <td>{expert.email}</td>
                      <td>{expert.fieldData.name}</td>
                      <td>{expert.phoneNumber}</td>
                      <td>{"More Info"}</td>
                      <td>
                        <div>
                          <button
                            onClick={() => updateExpertStatus(expert.id, true)}
                            className="btn btn-success"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateExpertStatus(expert.id, false)}
                            className="btn btn-danger ms-lg-2 mt-2 mt-lg-0"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                className="pagination-bar"
                currentPage={currentPageExpertVerifications}
                totalCount={expertVerifications.length}
                pageSize={pageSizeExpertVerifications}
                onPageChange={(page) => setCurrentPageExpertVerifications(page)}
              />
            </>
          )}
        </div>
        <div className="pt-5 d-flex flex-column justify-content-center align-items-center">
          <h2 className="font-frankruhllibre w-100 mb-3">Transactions</h2>
          {isLoadingTransactions ? (
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
                      ID
                    </th>
                    <th scope="col" className="th-col">
                      Expert
                    </th>
                    <th scope="col" className="th-col">
                      Customer
                    </th>
                    <th scope="col" className="th-col">
                      Session
                    </th>
                    <th scope="col" className="th-col">
                      Date Time
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
                  {currentTableDataTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <th scope="row" className="th-row">
                        {transaction.id}
                      </th>
                      <td>{transaction.expertData.fullName}</td>
                      <td>{transaction.customerData.fullName}</td>
                      <td>{transaction.consultation_time}</td>
                      <td>
                        {new Date(transaction.start_time.seconds).toUTCString()}
                      </td>
                      <td>{transaction.payment_amount}</td>
                      <td>{transaction.transaction_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                className="pagination-bar"
                currentPage={currentPageTransactions}
                totalCount={transactions.length}
                pageSize={pageSizeTransactions}
                onPageChange={(page) => setCurrentPageTransactions(page)}
              />
            </>
          )}
        </div>
        <div className="pt-5 d-flex flex-column justify-content-center align-items-center">
          <h2 className="font-frankruhllibre w-100 mb-3">
            Payment Verifications
          </h2>
          {isLoadingPaymentVerifications ? (
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
                    value={pageSizePaymentVerifications}
                    onChange={(e) => {
                      setPageSizePaymentVerifications(e.target.value);
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
                      ID
                    </th>
                    <th scope="col" className="th-col">
                      Date
                    </th>
                    <th scope="col" className="th-col">
                      Expert
                    </th>
                    <th scope="col" className="th-col">
                      Payment Prove
                    </th>
                    <th scope="col" className="th-col">
                      Customer
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
                  {currentTableDataPaymentVerifications.map((transaction) => (
                    <tr key={transaction.id}>
                      <th scope="row" className="th-row">
                        {transaction.id}
                      </th>
                      <td>{transaction.transaction_date}</td>
                      <td>{transaction.expertData.fullName}</td>
                      <td>
                        {<Link to={transaction.transaction_image}>Link</Link>}
                      </td>
                      <td>{transaction.customerData.fullName}</td>
                      <td>{transaction.payment_amount}</td>
                      <td>
                        <div>
                          {transaction.transaction_status == "unverified" ? (
                            <>
                              <button
                                onClick={async () => {
                                  const data = await updateTransactionStatus(
                                    transaction.id,
                                    true
                                  );
                                  if (data.statusCode === 200) {
                                    window.location.reload();
                                  }
                                }}
                                className="btn btn-success"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  updateTransactionStatus(transaction.id, false)
                                }
                                className="btn btn-danger ms-lg-2 mt-2 mt-lg-0"
                              >
                                Reject
                              </button>
                            </>
                          ) : transaction.transaction_status == "cancel" ? (
                            <p className="text-danger">Rejected</p>
                          ) : (
                            <p className="text-success">Accepted</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                className="pagination-bar"
                currentPage={currentPagePaymentVerifications}
                totalCount={paymentVerifications.length}
                pageSize={pageSizePaymentVerifications}
                onPageChange={(page) =>
                  setCurrentPagePaymentVerifications(page)
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
