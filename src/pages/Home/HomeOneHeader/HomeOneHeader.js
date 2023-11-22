import { useState } from "react";
import {
FaSearch,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import useGlobalContext from "../../../hooks/useGlobalContext";
import {
  IsAuthenticated,
  IsNotUserSmallComponent,
  IsAuthenticatedSmallComponent,
  IsExpert,
  IsExpertSmallComponent,
  IsNotAuthenticated,
  IsNotAuthenticatedSmallComponent,
  IsUserSmallComponent,
} from "../../Middleware/Middlewares";
import { logout } from "../../../controller/auth_controller/auth_controller";


const HomeOneHeader = () => {
  const targetElementId = 'about';
  const targetElementId2 = 'contact';

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { stickyMenu } = useGlobalContext();

  const handleLogout = () => {
    logout();
  };


  return (
    <>
      <header>
        <div className="header__area p-relative header__transparent">
          <div className="header__top d-none d-md-block">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xl-6 col-lg-5 col-md-4"></div>
              </div>
            </div>
          </div>
          <div
            id="header__sticky"
            className={stickyMenu ? "sticky header__bottom" : "header__bottom"}
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6">
                  <div className="logo">
                    <NavLink to="/">
                      <img src="../../assets/img/logo/logo.png" alt="logo" />
                    </NavLink>
                  </div>
                  <div className="logo-gradient">
                    <NavLink to="/">
                      <img
                        src="../../../assets/img/logo/logo-gradient.png"
                        alt="logo"
                      />
                    </NavLink>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-9 col-md-6 col-sm-6 col-6">
                  <div className="header__bottom-right d-flex justify-content-end align-items-center">
                    <div className="main-menu menu_wrapper_one">
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
                          <IsUserSmallComponent>
                            <li>
                              <NavLink to="/fields">Fields</NavLink>
                            </li>
                          </IsUserSmallComponent>
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
                        </ul>
                      </nav>
                    </div>
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
                      <div className="sidebar-toggle-btn" id="sidebar-toggle">
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
          <div className="header__search-wrapper">
            <div className="container">
              <div className="row">
                <div className="col-xl-12">
                  <form action="#">
                    <input type="text" placeholder="Your Keywords" />
                    <button type="button">
                      <i>
                        {" "}
                        <FaSearch />{" "}
                      </i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="body-overlay-2"></div>
        </div>
      </header>

      <Sidebar show={show} handleClose={handleClose} />
    </>
  );
};

export default HomeOneHeader;
