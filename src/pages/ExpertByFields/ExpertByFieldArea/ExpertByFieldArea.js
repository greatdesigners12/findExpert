// ExpertByFieldArea.js
import React, { useState, useEffect } from 'react';
import SingleTeam from '../../../components/SingleTeam/SingleTeam';
import { getExpertsByFieldAndStatus } from '../../../controller/fields_controller/fields_controller';
import { searchExpertsInField } from '../../../controller/fields_controller/fields_controller';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from "../../../components/shared/LoadingSpinner";

const ExpertByFieldArea = () => {
   const [expertsData, setExpertsData] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const params = useParams();
   const id = params.id;
 
   useEffect(() => {
     const getData = async () => {
       const data = await getExpertsByFieldAndStatus(id);
       setExpertsData(data);
     };
 
     getData();
   }, [id]);
 
   const handleSearch = async (e) => {
     e.preventDefault();
     const data = await searchExpertsInField(id, searchTerm);
     setExpertsData(data);
     console.log("tes", searchTerm)
     console.log("tes", data)
   };
 
   return (
     <>
       {expertsData.length === 0 ? <LoadingSpinner /> : (
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
             <form className="form-inline" onSubmit={handleSearch}>
               <input
                 className="form-control mr-sm-2"
                 type="search"
                 placeholder="Search"
                 aria-label="Search"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
             </form>
             <div className="row">
               {expertsData.data ? (
                 expertsData.data.map((expert) => (
                   <div key={expert.id}>
                     <a href={`/expertdetails/${expert.id}`}>
                       <SingleTeam name={expert.fullName} status={expert.status} />
                     </a>
                   </div>
                 ))
               ) : (
                 <p>No results found.</p>
               )}
             </div>
           </div>
         </section>
       )}
     </>
   );
 };
 
 export default ExpertByFieldArea;
 