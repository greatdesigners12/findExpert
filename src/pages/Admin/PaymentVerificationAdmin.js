import React, { useEffect, useMemo, useState } from "react";
import AdminPage from "./admin.component";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Form } from "react-bootstrap";
import Pagination from "../../components/Pagination/Pagination";
import {
  getAllTransactions,
  getAllUnverifiedTransactions,
  updateTransactionStatus,
} from "../../controller/admin_controller/admin_controller";
import { Link } from "react-router-dom";

export const PaymentVerificationAdmin = () => {
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
      <AdminPage>
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
      </AdminPage>
    </div>
  );
};
