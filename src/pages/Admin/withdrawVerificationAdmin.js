import React, { useEffect, useMemo, useState } from "react";
import AdminPage from "./admin.component";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Form } from "react-bootstrap";
import {
  getAllUnverifiedWithdrawalRequest,
  updateTransactionWithdrawStatus,
} from "../../controller/admin_controller/admin_controller";
import Pagination from "../../components/Pagination/Pagination";

export const WithdrawVerificationAdmin = () => {
  const [withdrawRequests, setWithdrawRequests] = useState([]);

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

  return (
    <div className="admin-page-bg">
      <AdminPage>
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
      </AdminPage>
    </div>
  );
};
