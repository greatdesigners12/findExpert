import React, { useState, useEffect, isLoading } from "react";
import { useParams } from "react-router-dom";
import CommonCtaArea from "../../components/CommonCtaArea/CommonCtaArea";
import PageHelmet from "../../components/shared/PageHelmet";
import StyleFiveHeader from "../Home/HeaderStyleFive/StyleFiveHeader";
import Footer from "../../components/shared/Footer";
import HomeThreeFaq from "../Home/HomeThree/HomeThreeFaq/HomeThreeFaq";
import HomeTwoTestimonial from "../Home/HomeTwo/HomeTwoTestimonial/HomeTwoTestimonial";
import HomeThreeProjects from "../Home/HomeThree/HomeThreeProjects/HomeThreeProjects";
import HomeThreeHeroSection from "../Home/HomeThree/HomeThreeHeroSection/HomeThreeHeroSection";
import HomeThreeSecondServices from "../Home/HomeThreeSecondServices/HomeThreeSecondServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "../../../src/components/shared/LoadingSpinner";
import {
  getAllFieldsWithExperts,
  getExpertsByFieldAndStatus,
} from "../../../src/controller/fields_controller/fields_controller";
import "./home.css";
import { ref } from 'react';
import { useContext } from "react";
import { UserContext, getValidatedUser } from "../../context/authContext.js";
import HomeServices from "../Home/HomeServices/HomeServices";
import { IsUserSmallComponent } from "../Middleware/Middlewares.js";
import { Link } from "react-router-dom";
import { getLatestExpertTransaction } from "../../controller/transaction_controller/transaction_controller.js";
import { useLocation } from 'react-router-dom';

export const HomeUser = () => {
  const [expertsData, setExpertsData] = useState([]);
  const [isLoadingHistory, setLoadingHistory] = useState(true);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const id = params.id;
  const name = params.name;
  const { userData, setUser } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const elementId = location.hash.substring(1); // Remove the leading '#' from the URL hash
    scrollToElement(elementId);
  }, [location]);

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      // Replace with the actual expert ID
      const user = await getValidatedUser();
        const expertId = user.uid; // Replace with the actual expert ID
        const result = await getLatestExpertTransaction(user.uid);
        console.log(userData.uid);
        setHistory(result.data);
        console.log(result.data);
        setLoadingHistory(false);

     
    };
    fetchHistory();
  }, []);

  const [fieldData, setFieldData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      const data = await getAllFieldsWithExperts();
      if (data.data != null){
        setFieldData(data);
        console.log(data);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <>
      <PageHelmet pageTitle="Home Page" />
      <StyleFiveHeader />
      <HomeThreeHeroSection />

      <div className="home-expert-page container">
        <IsUserSmallComponent>
          <div className="row">
            {isLoadingHistory ? (
              <LoadingSpinner />
            ) : (
              <div className="">
                <h3>Recent Consultation</h3>
                <div className="row">
                  {history ? (
                    history.map((historys) => {
                      let circleColor;

                      switch (historys.expert.status) {
                        case "online":
                          circleColor = "green";
                          break;
                        case "busy":
                          circleColor = "red";
                          break;
                        case "offline":
                          circleColor = "grey";
                          break;
                        default:
                          circleColor = "black"; // Default color jika status tidak sesuai
                      }

                      return (
                        <div
                          key={historys.expert.id}
                          className="col-xl-3 col-lg-4 col-md-6"
                        >
                          <a href={`/livechat/${historys.transaction.id}`}>
                            <div className="team__item p-relative text-center fix mb-30">
                              <div className="team__thumb mb-25">
                                <img
                                  src={historys.expert.profilePicture}
                                  alt="team"
                                />
                                <div
                                  className="status-circle"
                                  style={{ backgroundColor: circleColor }}
                                ></div>
                                <div className="team__info text-start">
                                  <h3>
                                    <Link to={`/transaction/${historys.id}`}>
                                      {historys.expert.fullName}
                                    </Link>
                                  </h3>
                                  <span>{name}</span>
                                </div>
                              </div>
                              <div className="team__content">
                                <h3>
                                  <Link to={`/transaction/${historys.id}`}>
                                    {historys.expert.fullName}
                                  </Link>
                                </h3>
                                <span>{name}</span>
                              </div>
                            </div>
                          </a>
                        </div>
                      );
                    })
                  ) : (
                    <p>No results found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </IsUserSmallComponent>
      </div>

      <section className="services__area pt-115 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
              <div
                className="section__title section__title-3 text-center mb-90 wow fadeInUp"
                data-wow-delay=".2s"
              >
                <span>Our Services</span>
                <h2>Provide various experts in every fields</h2>
              </div>
            </div>
          </div>

          <div className="row">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              fieldData.data.map((field) => (
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div key={field.id}>
                    <div className="services__item mb-90">
                      <div className="services__icon mb-35">
                        <img
                          src={field.icon}
                          alt="services"
                          height={60}
                          width={60}
                        />
                      </div>
                      <div className="services__content">
                        <h3>
                          <Link to={`/expertbyfield/${field.id}/${field.name}`}>
                            {field.name}
                          </Link>
                        </h3>
                        <p>{field.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <div id="about"><HomeThreeSecondServices /></div>
      <HomeTwoTestimonial />
      <HomeThreeProjects />
      <HomeThreeFaq />
      <div id="contact"><CommonCtaArea/></div>
      <Footer />
    </>
  );
};
