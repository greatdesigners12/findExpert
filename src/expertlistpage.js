import React from 'react';
import SingleTeam from './SingleTeam';
import { useEffect, useState } from 'react';
import { getAllExpertsData } from './controller/home_controller/home_controller';

export const TeamArea = () => {
    const [expertsData, setExpertsData] = useState([])
    useEffect(() => {
        const getData = async () => {
          const data = await getAllExpertsData();
          console.log(data);
          setExpertsData(data);
        } 
        
        getData();
    
      }, []);
   return (
      <>
         <section className="team__area pt-115 pb-110">
            <div className="container">
               <div className="row align-items-center mb-55">
                  <div className="col-xl-6 col-lg-8 col-md-8 col-sm-8">
                     <div className="section__title section__title-3 mb-30">
                        <span>Our Team</span>
                        <h2>We help to create visual strategies.</h2>
                     </div>
                  </div>
               </div>
               <div className="row">
               {expertsData.map((expert) => (<div>
            <SingleTeam image={expert.profilePicture} name={expert.fullName} title={expert.education} />
          </div>))}
               </div >
            </div >
         </section >
      </>
   );
};

export default TeamArea;