import React from 'react';
import CommonCtaArea from '../../components/CommonCtaArea/CommonCtaArea';
import PageHelmet from '../../components/shared/PageHelmet';
import StyleFiveHeader from '../Home/HeaderStyleFive/StyleFiveHeader';
import Footer from '../../components/shared/Footer';
import HomeThreeFaq from '../Home/HomeThree/HomeThreeFaq/HomeThreeFaq';
import HomeTwoTestimonial from '../Home/HomeTwo/HomeTwoTestimonial/HomeTwoTestimonial';
import HomeThreeProjects from '../Home/HomeThree/HomeThreeProjects/HomeThreeProjects';
import HomeThreeHeroSection from '../Home/HomeThree/HomeThreeHeroSection/HomeThreeHeroSection';
import HomeThreeServices from '../Home/HomeThree/HomeThreeServices/HomeThreeServices';
import HomeThreeSecondServices from '../Home/HomeThreeSecondServices/HomeThreeSecondServices';

export const HomeUser = () => {
    return (
      <>
        <PageHelmet pageTitle="Home Page" />
        <StyleFiveHeader />
        <HomeThreeHeroSection />
        <HomeThreeServices />
        <HomeThreeSecondServices />
        <HomeTwoTestimonial/>
        <HomeThreeProjects />
        <HomeThreeFaq />
        <CommonCtaArea/>
        <Footer/>
      </>
    );
};
