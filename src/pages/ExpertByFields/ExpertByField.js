import React from 'react';
import CommonCtaArea from '../../components/CommonCtaArea/CommonCtaArea';
import CommonPageHeader from '../../components/CommonPageHeader/CommonPageHeader';
import Footer from '../../components/shared/Footer';
import PageHelmet from '../../components/shared/PageHelmet';
import HomeOneHeader from '../Home/HomeOneHeader/HomeOneHeader';
import ExpertByFieldArea from './ExpertByFieldArea/ExpertByFieldArea';

export const ExpertByField = () => {
   return (
      <>
         <PageHelmet pageTitle="Expert Page" />

         <HomeOneHeader/>
         <CommonPageHeader title="Experts List" subtitle="Team" />
         <ExpertByFieldArea/>
         <CommonCtaArea/>
         <Footer/>
      </>
   );
};

export default ExpertByField;