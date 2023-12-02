import React from "react";
import { Link } from "react-router-dom";

const HomeThreeSecondSingleService = ({ title }) => {
  return (
    <>
      <div className="services__nav-content pt-90 pb-90">
        <div className="row">
          <div className="col-xl-5 col-lg-6">
            <div className="services__thumb text-lg-right m-img">
              <img src="assets/img/services/services-1.png" alt="" />
            </div>
          </div>
          <div className="col-xl-7 col-lg-6">
            <div className="services__content-3 pl-70 pr-70">
              <h3>{title}</h3>
              <p>
              Struggling with a challenge? Connect with our network of experts who are ready to guide you. Whether it's professional advice, personal support, or specialized knowledge, we have the right experts to help you overcome obstacles. Describe your situation, and we'll match you with the expertise you need. You don't have to face it alone – let our community of experts support you on your journey.
              </p>
              <div className="services__icon-wrapper d-md-flex mb-35">
                <div className="services__icon-item d-flex mr-60 mb-30">
                  <div className="icon mr-20">
                    <img src="assets/img/icon/services/services-9.png" alt="" />
                  </div>
                  <div className="text">
                    <h3>Consult to the Expert</h3>
                  </div>
                </div>
                <div className="services__icon-item d-flex mb-30">
                  <div className="icon mr-20">
                    <img
                      src="assets/img/icon/services/services-10.png"
                      alt=""
                    />
                  </div>
                  <div className="text">
                    <h3>Help Your Tech Problems</h3>
                  </div>
                </div>
              </div>
              <Link
                to="https://api.whatsapp.com/send/?phone=6281216501976&text=Hello+I+want+to+get+started&type=phone_number&app_absent=0"
                className="z-btn"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeThreeSecondSingleService;
