import React from 'react';
import CommonCtaArea from '../../components/CommonCtaArea/CommonCtaArea';
import CommonPageHeader from '../../components/CommonPageHeader/CommonPageHeader';
import Footer from '../../components/shared/Footer';
import PageHelmet from '../../components/shared/PageHelmet';
import HomeOneHeader from '../Home/HomeOneHeader/HomeOneHeader';
import ExpertArea from './ExpertArea/ExpertArea';

export const Expert = () => {
   return (
      <>
         <PageHelmet pageTitle="Expert Page" />

         <HomeOneHeader/>
         <CommonPageHeader title="Experts List" subtitle="Team" />
         <ExpertArea/>
         <CommonCtaArea/>
         <Footer/>
      </>
   );
};

export default Expert;