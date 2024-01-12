import React, { useEffect, useMemo, useState } from "react";
import AdminPage from "./admin.component";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Form } from "react-bootstrap";
import Pagination from "../../components/Pagination/Pagination";
import { getAllTransactions, getAllUnverifiedExperts, updateExpertStatus } from "../../controller/admin_controller/admin_controller";

export const ExpertVerificationsAdmin = () => {
  const [expertVerifications, setExpertVerifications] = useState([]);

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

  return (
    <div className="admin-page-bg">
      <AdminPage>
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
                    {/* <th scope="col" className="th-col">
                      More Information
                    </th> */}
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
                      {/* <td>{"More Info"}</td> */}
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
      </AdminPage>
    </div>
  );
};
