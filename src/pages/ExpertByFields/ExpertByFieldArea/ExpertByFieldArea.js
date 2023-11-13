// ExpertByFieldArea.js
import React, { useState, useEffect } from "react";
// import SingleTeam from '../../../components/SingleTeam/SingleTeam';
import { getExpertsByFieldAndStatus } from "../../../controller/fields_controller/fields_controller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../../../components/shared/LoadingSpinner";
// import React from 'react';
import { Link } from "react-router-dom";
import "./expert.css";
const ExpertByFieldArea = () => {
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
      {expertsData.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <section className="team__area pt-50 pb-110">
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

            <div className="row align-items-center mb-55">
              <div className="col-xl-6 col-lg-8 col-md-8 col-sm-8">
                <div className="section__title section__title-3 mb-30 pt-3">
                  <span>Experts</span>
                  <h2>{name}</h2>
                </div>
              </div>
            </div>

            <div className="row">
              {expertsData.data ? (
                expertsData.data.map((expert) => {
                  let circleColor;

                  switch (expert.status) {
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
                    <div key={expert.id} className="col-xl-3 col-lg-4 col-md-6">
                      <a href={`/expertdetails/${expert.id}`}>
                        <div className="team__item p-relative text-center fix mb-30">
                          <div className="team__thumb mb-25">
                            <img src={expert.profilePicture} alt="team" />
                            <div
                              className="status-circle"
                              style={{ backgroundColor: circleColor }}
                            ></div>
                            <div className="team__info text-start">
                              <h3>
                                <Link to={`/expertdetails/${expert.id}`}>
                                  {expert.fullName}
                                </Link>
                              </h3>
                              <span>{name}</span>
                            </div>
                          </div>
                          <div className="team__content">
                            <h3>
                              <Link to={`/expertdetails/${expert.id}`}>
                                {expert.fullName}
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
        </section>
      )}
    </>
  );
};

export default ExpertByFieldArea;
