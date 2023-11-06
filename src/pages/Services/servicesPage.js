
import {getAllFieldsWithExperts} from '../../controller/fields_controller/fields_controller'
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
export const ServicesPages = () => {
    const [fieldData, setFieldData] = useState([])
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        const getData = async () => {
          const data = await getAllFieldsWithExperts();
          setFieldData(data);
          console.log(data)
          setLoading(false);
        } 
        getData();
      }, []);
      return (
        <div>
    
              <section className="services__area pt-115 pb-80">
                 <div className="container">
                    <div className="row">
                       <div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
                          <div className="section__title section__title-3 text-center mb-90 wow fadeInUp" data-wow-delay=".2s">
                             <span>Our Services</span>
                             <h2>Provide awesome customer service with our tools.</h2>
                          </div>
                       </div>
                    </div>

                    <div className="row">
  {isLoading ? "Loading..." : (
            fieldData.data.map((field) => (
              
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div key={field.id}>
               
            <div className="services__item mb-90">
               <div className="services__icon mb-35">
                  <img src={field.icon} alt="services" height={60} width={60}/>
               </div>
               <div className="services__content">
                  <h3><Link to="/servicesDetails">{field.name}</Link></h3>
                  <p>{field.description}</p>
               </div>
            </div>
         </div> 
         </div>
               
                 
            )))
          }
              </div>
                 </div>
              </section>
           </div>
         
       
     
      )
}