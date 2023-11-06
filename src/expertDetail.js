import React from 'react';
// import SingleTeam from './SingleTeam';
import { useEffect, useState } from 'react';
import {ExpertsController} from './controller/experts_controller/experts_controller';
import { useParams } from 'react-router-dom';

export const ExpertDetail = () => {
    const [expertsData, setExpertsData] = useState(null)
    // Ambil id di url
    // /expertDetail/:id
    const params = useParams();
    const id = params.id
    useEffect(() => {
        console.log('hi');
        const getData = async () => {
        const ec = new ExpertsController()
        const data = await ec.getExpertById(id);
        // if (data.statusCode != 200){
            
        // }
          console.log(data);
          setExpertsData(data);
        } 
        
        getData();
    
      }, []);
   return (
    
    <>
    {/* <h1>{expertsData.statusCode == 200 ? "Berhasil" : "Ada Masalah"}</h1> */}
    {expertsData == null ? "Loading.." : (
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
                
                <h1>{expertsData.data.fullName}</h1>
               </div >
            </div >
         </section > 
     )};
     </>
   );
};

export default ExpertDetail;