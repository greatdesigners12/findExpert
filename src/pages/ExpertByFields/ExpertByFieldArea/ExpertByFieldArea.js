import React from 'react';
import SingleTeam from '../../../components/SingleTeam/SingleTeam';
import { useEffect, useState } from 'react';
import { getExpertsByFieldAndStatus} from '../../../controller/fields_controller/fields_controller';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from "../../../components/shared/LoadingSpinner";


export const ExpertByFieldArea = () => {
   const [expertsData, setExpertsData] = useState([])
   const params = useParams();
   const id = params.id;
   useEffect(() => {
      const getData = async () => {
        const data = await getExpertsByFieldAndStatus(id);
        console.log(data);
        setExpertsData(data);
      };
  
      getData();
    }, []);
  return (
     <>
     {expertsData.length == 0 ? <LoadingSpinner/> : (
      
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
              {expertsData.data.map((expert) => (
              <div>
               
               <a href={`/expertdetails/${expert.id}`}>
               <SingleTeam  name={expert.fullName} status={expert.status} />
               </a>
         </div>))}
              </div >
           </div >
        </section >
         
        )};
     </>
  );
};

export default ExpertByFieldArea;