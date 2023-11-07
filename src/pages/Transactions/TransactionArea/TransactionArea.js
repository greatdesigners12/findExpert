import React from "react";
import SingleTeam from "../../../components/SingleTeam/SingleTeam";
import { useEffect, useState } from "react";
import { ExpertsController } from "../../../controller/experts_controller/experts_controller";
// import { useParams } from 'react-router-dom';

export const TransactionArea = () => {
  return (
    <>
        <section className="team__area pt-115 pb-110">
          <div className="container">
            <div className="row align-items-center mb-55">
              <div className="col-xl-6 col-lg-8 col-md-8 col-sm-8">
                <div className="section__title section__title-3 mb-30">
                  <h2>Steps To Complete The Payment</h2>
                </div>
              </div>
            </div>
            <div className="row">
               {/* <h1>{hours}</h1> */}
              {/* {expertsData.data.map((expert) => (
                <div>
                  <a href={`/expertdetails/${expert.id}`}>
                    <SingleTeam
                      image={expert.profilePicture}
                      name={expert.fullName}
                      title={expert.education}
                      status={expert.status}
                    />
                  </a>
                </div>
              ))} */}
            </div>
          </div>
        </section>
      ;
    </>
  );
};

export default TransactionArea;
