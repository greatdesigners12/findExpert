import React from 'react';
import CommonCtaArea from '../../components/CommonCtaArea/CommonCtaArea';
import CommonPageHeader from '../../components/CommonPageHeader/CommonPageHeader';
import Footer from '../../components/shared/Footer';
import PageHelmet from '../../components/shared/PageHelmet';
import HomeOneHeader from '../Home/HomeOneHeader/HomeOneHeader';
import ExpertArea from './ExpertArea/ExpertArea';

const Expert = () => {
   return (
      <>
         <PageHelmet pageTitle="Team Page" />

         <HomeOneHeader/>
         <CommonPageHeader title="Our Team" subtitle="Team" />
         <ExpertArea/>
         <CommonCtaArea/>
         <Footer/>
      </>
   );
};

export default Expert;