import React from "react";
import CommonCtaArea from "../../components/CommonCtaArea/CommonCtaArea";
import CommonPageHeader from "../../components/CommonPageHeader/CommonPageHeader";
import Footer from "../../components/shared/Footer";
import PageHelmet from "../../components/shared/PageHelmet";
import HomeOneHeader from "../Home/HomeOneHeader/HomeOneHeader";
import TransactionArea from "./TransactionArea/TransactionArea";

const Transaction = () => {
  return (
    <>
      <PageHelmet pageTitle="Transaction Page" />
      <HomeOneHeader />
      <CommonPageHeader title="Transaction" subtitle="Transaction" />
      <TransactionArea />
      <CommonCtaArea />
      <Footer />
    </>
  );
};

export default Transaction;
