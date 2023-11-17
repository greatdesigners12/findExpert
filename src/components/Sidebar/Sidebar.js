import React from "react";
import { Offcanvas } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../../controller/auth_controller/auth_controller";
import useGlobalContext from "../../hooks/useGlobalContext";
import { useState } from "react";

import {
  IsAuthenticated,
  IsAuthenticatedSmallComponent,
  IsExpert,
  IsExpertSmallComponent,
  IsNotAuthenticated,
  IsNotUserSmallComponent,
  IsNotAuthenticatedSmallComponent,
  IsUserSmallComponent,
} from "../../pages/Middleware/Middlewares";

const Sidebar = ({ show, handleClose }) => {
  const targetElementId = "about";
  const targetElementId2 = "contact";
  const [shows, setShows] = useState(false);

  const handleShow = () => setShows(true);
  const { stickyMenu } = useGlobalContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div>
        <Offcanvas
          show={show}
          onHide={handleClose}
          placement="end"
          className="side__bar"
        >
          <Offcanvas.Header closeButton>
            <div className="logo">
              <a href="index.html">
                <img src="assets/img/logo/logo.png" alt="logo" />
              </a>
            </div>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <section>
              <div className="p-0">
                <div className="sidebar__content">
                  <div className="tab-content" id="sidebar-tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="menu"
                      role="tabpanel"
                      aria-labelledby="menu-tab"
                    >
                      <div className="side_navBar">
                          <ul>
                            <IsExpertSmallComponent>
                              <li>
                                <NavLink to="/homeexpert/">Home</NavLink>
                              </li>
                            </IsExpertSmallComponent>
                            <IsUserSmallComponent>
                              <li>
                                <NavLink to="/">Home</NavLink>
                              </li>
                            </IsUserSmallComponent>
                            <IsNotUserSmallComponent>
                            <li>
                              <NavLink to="/">Home</NavLink>
                            </li>
                          </IsNotUserSmallComponent>
                            <li>
                              <NavLink
                                to={`/#${targetElementId}`}
                                spy={true}
                                smooth={true}
                                offset={50}
                                duration={500}
                              >
                                About Us
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/fields">Fields</NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/#${targetElementId2}`}
                                spy={true}
                                smooth={true}
                                offset={50}
                                duration={500}
                              >
                                Contact Us
                              </NavLink>{" "}
                            </li>
                            <li>
                            <IsNotAuthenticatedSmallComponent>
                              
                                <NavLink to="/login"  className="z-btn z-btn-white">Login</NavLink>
                              
                            </IsNotAuthenticatedSmallComponent>
                            <IsAuthenticatedSmallComponent>
                        
                                <NavLink onClick={handleLogout}  className="z-btn z-btn-white">Logout</NavLink>
                            
                            </IsAuthenticatedSmallComponent>
                            </li>
                          </ul>

                         
                          
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default Sidebar;
