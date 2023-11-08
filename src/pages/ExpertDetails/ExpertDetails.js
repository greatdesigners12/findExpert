import React from 'react';
import CommonCtaArea from '../../components/CommonCtaArea/CommonCtaArea';
import CommonPageHeader from '../../components/CommonPageHeader/CommonPageHeader';
import Footer from '../../components/shared/Footer';
import PageHelmet from '../../components/shared/PageHelmet';
import HomeOneHeader from '../Home/HomeOneHeader/HomeOneHeader';
import ExpertDetailsArea from './ExpertDetailsArea/ExpertDetailsArea';

export const ExpertDetails = () => {
   return (
      <>
         <PageHelmet pageTitle="Expert Details Page" />

         <HomeOneHeader/>
         <CommonPageHeader title="Expert Details" subtitle="Expert Details" />
         <ExpertDetailsArea/>
         <CommonCtaArea/>
         <Footer/>
      </>
   );
};

export default ExpertDetails;