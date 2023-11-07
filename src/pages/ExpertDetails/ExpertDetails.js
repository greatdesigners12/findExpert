import React from 'react';
import CommonCtaArea from '../../components/CommonCtaArea/CommonCtaArea';
import CommonPageHeader from '../../components/CommonPageHeader/CommonPageHeader';
import Footer from '../../components/shared/Footer';
import PageHelmet from '../../components/shared/PageHelmet';
import HomeOneHeader from '../Home/HomeOneHeader/HomeOneHeader';
import ExpertDetailsArea from './ExpertDetailsArea/ExpertDetailsArea';

const ExpertDetails = () => {
   return (
      <>
         <PageHelmet pageTitle="Team Details Page" />

         <HomeOneHeader/>
         <CommonPageHeader title="Team Details" subtitle="Team Details" />
         <ExpertDetailsArea/>
         <CommonCtaArea/>
         <Footer/>
      </>
   );
};

export default ExpertDetails;