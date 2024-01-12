import { useState } from "react";
import {
  getTotalEquity,
  getTotalNumberConsultans,
  getTotalNumberTransactions,
} from "../../controller/admin_controller/admin_controller";

import { useEffect } from "react";
import PageHelmet from "../../components/shared/PageHelmet";
import { NavLink } from "react-router-dom";
import { logout } from "../../controller/auth_controller/auth_controller";
import SidebarAdmin from "../../components/sidebar-admin/sidebar-admin.component";

const AdminPage = ({ children }) => {
  const [equity, setEquity] = useState("");
  const [transactionCount, setTransactionCount] = useState(0);
  const [consultantCount, setConsultantCount] = useState(0);

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

  return (
    <div className="admin-page-bg">
      <SidebarAdmin>
        <div className="w-100 admin-sidebar-margin">
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
            <button className="btn btn-danger me-4">
              <NavLink onClick={handleLogout} className="">
                Logout
              </NavLink>
            </button>
          </div>
          <div className="container py-5">
            <div className="row d-flex flex-row justify-content-evenly">
              <div className="col-lg-4 col-12">
                <div className="admin-info-card px-5 py-4">
                  <h2 className="font-frankruhllibre">Equity</h2>
                  <h3 className="font-montserrat color-purple mt-2">
                    {equity}
                  </h3>
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
            <main>{children}</main>
          </div>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default AdminPage;