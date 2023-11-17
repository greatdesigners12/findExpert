import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import useGlobalContext from "../../../hooks/useGlobalContext";
import {
  IsAuthenticated,
  IsAuthenticatedSmallComponent,
  IsExpert,
  IsExpertSmallComponent,
  IsNotAuthenticated,
  IsNotUserSmallComponent, 
  IsNotAuthenticatedSmallComponent,
  IsUserSmallComponent,
} from "../../Middleware/Middlewares";
import { logout } from "../../../controller/auth_controller/auth_controller";

const StyleFiveHeader = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { stickyMenu } = useGlobalContext();

  const handleClickScroll = () => {
    const element = document.getElementById('about');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClickScrollContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header>
        <div className="header__area p-relative header__transparent">
          <div className="header__shape p-absolute">
            <img src="assets/img/icon/slider/03/icon-5.png" alt="" />
          </div>
          <div
            id="header__sticky"
            className={
              stickyMenu
                ? "sticky header__bottom header__bottom-2 header__style-4 header__style-5"
                : "header__bottom header__bottom-2 header__style-4 header__style-5"
            }
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xl-11 col-lg-10 col-md-6 col-sm-6 col-6">
                  <div className="header__style-3-left d-flex align-items-center">
                    <div className="logo-3 mr-50">
                      <NavLink to="/">
                        <img
                          src="../assets/img/logo/logo-gradient.png"
                          alt="logo"
                        />
                      </NavLink>
                    </div>
                    <div className="col-xl-4 col-lg-3 col-md-3"></div>
                    <div className="main-menu main-menu-3 header_style_nav_five">
                      <nav id="mobile-menu">
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
                            <NavLink onClick={handleClickScroll}>
                              About Us{" "}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/fields">Fields</NavLink>
                          </li>
                          <li>
                            <NavLink onClick={handleClickScrollContact}>
                              Contact Us
                            </NavLink>
                          </li>
                          {/* <IsNotAuthenticatedSmallComponent>
                             <li>
                               <NavLink to="/login">Login</NavLink>
                             </li>
                           </IsNotAuthenticatedSmallComponent>
                           <IsAuthenticated>
                           <li>
                               <NavLink onClick={handleLogout}>Logout</NavLink>
                             </li>
                           </IsAuthenticated> */}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="col-xl-1 col-lg-2 col-md-6 col-sm-6 col-6">
                  <div className="header__bottom-right d-flex justify-content-end align-items-center">
                    <div className="header__btn d-none d-sm-block d-lg-none d-xl-block ml-50">
                      <IsNotAuthenticatedSmallComponent>
                        <NavLink to="/login" className="z-btn z-btn-white">
                          Login
                        </NavLink>
                      </IsNotAuthenticatedSmallComponent>
                      <IsAuthenticatedSmallComponent>
                        <NavLink
                          onClick={handleLogout}
                          className="z-btn z-btn-white"
                        >
                          Logout
                        </NavLink>
                      </IsAuthenticatedSmallComponent>
                    </div>
                    <div
                      onClick={handleShow}
                      className="sidebar__menu d-lg-none"
                    >
                      <div
                        className="sidebar-toggle-btn sidebar-toggle-btn-3"
                        id="sidebar-toggle"
                      >
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sidebar show={show} handleClose={handleClose} />
    </>
  );
};

export default StyleFiveHeader;
