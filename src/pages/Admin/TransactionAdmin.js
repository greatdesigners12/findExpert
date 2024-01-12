import React, { useEffect, useMemo, useState } from "react";
import AdminPage from "./admin.component";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Form } from "react-bootstrap";
import Pagination from "../../components/Pagination/Pagination";
import { getAllTransactions } from "../../controller/admin_controller/admin_controller";

export const TransactionAdmin = () => {
  const [transactions, setTransactions] = useState([]);

  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
  const [pageSizeTransactions, setPageSizeTransactions] = useState(0);

  const currentTableDataTransactions = useMemo(() => {
    const firstPageIndex = (currentPageTransactions - 1) * pageSizeTransactions;
    const lastPageIndex = firstPageIndex + pageSizeTransactions;

    return transactions.slice(firstPageIndex, lastPageIndex);
  }, [currentPageTransactions, pageSizeTransactions]);

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

  return (
    <div className="admin-page-bg">
      <AdminPage>
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
      </AdminPage>
    </div>
  );
};
