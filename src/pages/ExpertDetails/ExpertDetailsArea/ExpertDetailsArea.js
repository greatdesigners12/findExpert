import React from 'react';
import { BiMap } from 'react-icons/bi';
import { FaEnvelope, FaFacebookF, FaPhoneAlt, FaTwitter, FaVimeoV } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { ExpertsController } from "../../../controller/experts_controller/experts_controller";
import { useParams } from "react-router-dom";
import "./expertdetail.css";

export const ExpertDetailsArea = () => {
  const [expertsData, setExpertsData] = useState(null);
  const [timeIntervals, setTimeIntervals] = useState(1);
  const [count, setCountIntervals] = useState(30);

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
        "Loading.."
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
                  <div className="team__details-content pt-105">
                    <span>{expertsData.data.field.name}</span>
                    <h3>{expertsData.data.fullName}</h3>
                    <p>{expertsData.data.jobExperience}</p>
                    <div className="team__details-contact mb-45">
                      <ul>
                        <li>
                          <div className="icon theme-color ">
                            <i>
                              {" "}
                              <FaEnvelope />{" "}
                            </i>
                          </div>
                          <div className="text theme-color ">
                            {/* {`/expertdetails/${expert.id}`} */}
                            <h4>Rp. {expertsData.data.price} / Jam</h4>
                          </div>
                        </li>
                        <li>
                          <div className="icon theme-color">
                            <i>
                              <FaPhoneAlt />{" "}
                            </i>
                          </div>
                          <div className="text theme-color">
                            <div>
                              <button
                                className="custom-button" // Apply the custom button class
                                onClick={handleDecrementTime}
                              >
                                -
                              </button>
                              {count} mins
                              <button
                                className="custom-button" // Apply the custom button class
                                onClick={handleIncrementTime}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="address-button">
                           <Link to={`/transaction/${expertsData.data.id}/${timeIntervals}`} className="z-btn">
                              Consult
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="team__details-social theme-social">
                      <ul>
                        <li>
                          <a href="#">
                            <i>
                              <FaFacebookF />
                            </i>
                            <i>
                              <FaFacebookF />
                            </i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i>
                              <FaTwitter />{" "}
                            </i>
                            <i>
                              <FaTwitter />{" "}
                            </i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i>
                              <FaVimeoV />{" "}
                            </i>
                            <i>
                              <FaVimeoV />{" "}
                            </i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="team__details-info mt-60">
                  <h4>Information</h4>
                  <p>
                    jolly good codswallop what a plonker he nicked it
                    bog-standard porkies gosh the full monty, wind up at public
                    school hanky panky cheeky bugger Richard do one some dodgy
                    chav bite your arm off. Argy-bargy excuse my French brown
                    bread up the duff bleeder fanny around spend a penny barmy
                    bonnet, bubble and squeak brolly bugger no biggie smashing
                    get stuffed mate old lurgy, cup of tea nice one mufty that I
                    knackered some dodgy chav. Say vagabond morish crikey excuse
                    my French bonnet William blatant spend a penny, knackered
                    bite your arm off what a plonker blimey smashing a blinding
                    shot pardon me grub, wind up cracking goal Jeffrey hanky
                    panky are you taking the piss such a fibber hunky-dory.
                  </p>
                  <p>
                    So I said on your bike mate easy peasy dropped a clanger
                    blow off porkies is fantastic show off show off pick your
                    nose and blow off, faff about bubble and squeak bugger all
                    mate happy days hotpot don't get shirty with me jolly good
                    gormless barmy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      ;
    </>
  );
};

export default ExpertDetailsArea;
