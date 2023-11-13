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
import { getExpertsByFieldAndStatus } from "../../../src/controller/fields_controller/fields_controller";
import "./home.css";
import HomeServices from "../Home/HomeServices/HomeServices";

export const HomeUser = () => {
  const [expertsData, setExpertsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const id = params.id;
  const name = params.name;

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
      <div className="row">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="">
            <h3>Recent Consultation</h3>
            <div className="col-xl-3 col-lg-4 col-md-6 mt-30">
              <div className="textdeco text-center mb-30">
                <div className="team__thumb mb-25">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/400px-Siberischer_tiger_de_edit02.jpg"
                    alt="team"
                  />
                </div>
                <div className="team__content">
                  <h3>nnn</h3>
                  <span>mmm</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      <HomeServices />
      <HomeThreeSecondServices />
      <HomeTwoTestimonial />
      <HomeThreeProjects />
      <HomeThreeFaq />
      <CommonCtaArea />
      <Footer />
    </>
  );
};
