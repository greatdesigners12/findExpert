import React from 'react';
import SingleTeam from '../../../components/SingleTeam/SingleTeam';
import { useEffect, useState } from 'react';
import { ExpertsController} from '../../../controller/experts_controller/experts_controller';

export const ExpertArea = () => {
    const [expertsData, setExpertsData] = useState([])
    useEffect(() => {
        console.log('hi');
        const getData = async () => {
        const ec = new ExpertsController()
        const data = await ec.getAllVerifiedExperts();
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
                <SingleTeam image={expert.data.profilePicture} name={expert.data.fullName} title={expert.data.education} />
          </div>))}
               </div >
            </div >
         </section >
      </>
   );
};

export default ExpertArea;