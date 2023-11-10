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

      <HomeOneHeader />
      <CommonPageHeader title="Transaction List" subtitle="Transaction List" />
      <Footer />
    </>
  );
};
