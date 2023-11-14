import { FaClock } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillAlt } from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "../../../components/shared/LoadingSpinner";
import "./expertdetail.css";
import { ExpertsController } from "../../../controller/experts_controller/experts_controller";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

export const ExpertDetailsArea = () => {
  const [expertsData, setExpertsData] = useState(null);
  const [timeIntervals, setTimeIntervals] = useState(1);
  const [count, setCountIntervals] = useState(30);
  const isExpertAvailable = useMemo(() => {
    if (expertsData != null) {
      return !(
        expertsData.data.status == "offline" ||
        expertsData.data.status == "busy"
      );
    } else {
      return false;
    }
  }, [expertsData]);

  // Ambil id di url
  // /expertDetail/:id
  const params = useParams();
  const id = params.id;
  const handleIncrementTime = () => {
    setTimeIntervals(timeIntervals + 1);
    setCountIntervals(count + 30);
  };

  const handleDecrementTime = () => {
    if (timeIntervals > 1) {
      setTimeIntervals(timeIntervals - 1);
      setCountIntervals(count - 30);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const ec = new ExpertsController();
      const data = await ec.getExpertById(id);
      console.log(data);
      setExpertsData(data);
    };

    getData();
  }, []);

  return (
    <>
      {expertsData == null ? (
        <LoadingSpinner />
      ) : (
        <section className="team__details pt-120 pb-160">
          <div className="container">
            <div className="team__details-inner p-relative white-bg">
              <div className="team__details-shape p-absolute">
                <img src="assets/img/icon/team/shape-1.png" alt="" />
              </div>
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <div className="team__details-img w-img mr-70">
                    <img src={expertsData.data.profilePicture} alt="" />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <div className="team__details-content pt-50 pb-100">
                    <span>{expertsData.data.field.name}</span>
                    <h3>{expertsData.data.fullName}</h3>
                    <h5>{expertsData.data.education}</h5>
                    <h4>Rp. {expertsData.data.price} / Jam</h4>
                    <div className="py-2">
                      <button
                        className="custom-button"
                        onClick={handleDecrementTime}
                      >
                        -
                      </button>{" "}
                      {count} mins{" "}
                      <button
                        className="custom-button"
                        onClick={handleIncrementTime}
                      >
                        +
                      </button>
                    </div>
                    <div className="address-button">
                      {isExpertAvailable ? (
                        <Link
                          to={`/transaction/${expertsData.data.id}/${timeIntervals}`}
                          className="z-btn custom-consult-button"
                        >
                          Consult
                        </Link>
                      ) : (
                        <button
                          className="z-btn custom-consult-button unavailable"
                          disabled
                        >
                          Experts currently unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="team__details-info mt-60">
                  <h4>Information</h4>
                  <p>{expertsData.data.jobExperience}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ExpertDetailsArea;
