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
import { useContext } from "react";
import { UserContext } from "../../context/authContext.js";
import HomeServices from "../Home/HomeServices/HomeServices";
import { IsUserSmallComponent } from "../Middleware/Middlewares.js";
import { Link } from "react-router-dom";
import { getLatestExpertTransaction } from "../../controller/transaction_controller/transaction_controller.js";

export const HomeUser = () => {
  const [expertsData, setExpertsData] = useState([]);
  const [isLoadingHistory, setLoadingHistory] = useState(true);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const id = params.id;
  const name = params.name;
  const { userData, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchHistory = async () => {
      // Replace with the actual expert ID
      const expertId = userData.uid; // Replace with the actual expert ID
      const result = await getLatestExpertTransaction(userData.uid);
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
      setFieldData(data);
      console.log(data);
      setLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = await getExpertsByFieldAndStatus(id);
      setExpertsData(data);
      console.log(data);
    };

    getData();
  }, [id]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      // If the search term is empty, reset to the original data
      const data = await getExpertsByFieldAndStatus(id);
      setExpertsData(data);
    } else {
      // Filter the data based on the search term
      const filteredData = expertsData.data.filter((expert) =>
        expert.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setExpertsData({ data: filteredData });
    }
  };
  return (
    <>
      <PageHelmet pageTitle="Home Page" />
      <StyleFiveHeader />
      <HomeThreeHeroSection />

      <div className="container">
        <form className="d-flex mb-3" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-purple focus-purple"
                type="submit"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
        </form>
      </div>
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
                    <div key={historys.expert.id} className="col-xl-3 col-lg-4 col-md-6">
                      <a href={`/expertdetails/${historys.expert.id}`}>
                        <div className="team__item p-relative text-center fix mb-30">
                          <div className="team__thumb mb-25">
                            <img src={historys.expert.profilePicture} alt="team" />
                            <div
                              className="status-circle"
                              style={{ backgroundColor: circleColor }}
                            ></div>
                            <div className="team__info text-start">
                              <h3>
                                <Link to={`/expertdetails/${historys.expert.id}`}>
                                  {historys.expert.fullName}
                                </Link>
                              </h3>
                              <span>{name}</span>
                            </div>
                          </div>
                          <div className="team__content">
                            <h3>
                              <Link to={`/expertdetails/${historys.expert.id}`}>
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
      <HomeThreeSecondServices />
      <HomeTwoTestimonial />
      <HomeThreeProjects />
      <HomeThreeFaq />
      <CommonCtaArea />
      <Footer />
    </>
  );
};
