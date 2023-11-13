import React from 'react';
import { CgArrowLongRight } from 'react-icons/cg';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HomeThreeSingleService from '../HomeThreeSingleService/HomeThreeSingleService';

const HomeThreeServices = () => {
   return (
      <>
         <section className="services__area-2 mt--120 pt-270 pb-140 p-relative" style={{backgroundPosition: 'bottom', backgroundSize: 'cover' }}>
            <div className="container">
               <div className="row g-0">

                  <HomeThreeSingleService image="1" title="Share Knowledge" subtitle="Data Tracking" />
                  <HomeThreeSingleService image="2" title="Meet New Friends" subtitle="User Experience" />
                  <HomeThreeSingleService image="3" title="Customer Service" subtitle="App Design" />
                  <HomeThreeSingleService image="4" title="Strategic advice" subtitle="Press Releases" />

               </div>
            </div>
         </section>
      </>
   );
};

export default HomeThreeServices;