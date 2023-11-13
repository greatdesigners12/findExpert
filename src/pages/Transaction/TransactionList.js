import React from "react";
import CommonCtaArea from "../../components/CommonCtaArea/CommonCtaArea";
import CommonPageHeader from "../../components/CommonPageHeader/CommonPageHeader";
import Footer from "../../components/shared/Footer";
import PageHelmet from "../../components/shared/PageHelmet";
import HomeOneHeader from "../Home/HomeOneHeader/HomeOneHeader";

export const TransactionList = () => {
  return (
    <>
      <PageHelmet pageTitle="Transaction List" />
      <link rel="stylesheet" href="assets/css/transaction-list.css" />
      <HomeOneHeader /> 
      <CommonPageHeader title="Transaction List" subtitle="Transaction List" />

      <div className="container py-5 font-montserrat">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Payment Amount</th>
              <th scope="col">Consultation Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};
