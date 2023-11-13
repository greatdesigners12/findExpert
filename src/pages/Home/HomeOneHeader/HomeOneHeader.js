import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaPhoneAlt, FaEnvelope, FaSearch, FaLinkedinIn } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import useGlobalContext from '../../../hooks/useGlobalContext';
import { IsExpert, IsExpertSmallComponent, IsNotAuthenticated, IsNotAuthenticatedSmallComponent } from '../../Middleware/Middlewares';

const HomeOneHeader = () => {
   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const { stickyMenu } = useGlobalContext();
   return (
     <>
       <header>
         <div className="header__area p-relative header__transparent">
           <div className="header__top d-none d-md-block">
             <div className="container">
               <div className="row align-items-center">
                 <div className="col-xl-6 col-lg-5 col-md-4"></div>
                 {/* <div className="col-xl-6 col-lg-7 col-md-8">
                           <div className="header__info f-right">
                              <ul>
                                 <li>
                                    <a href="tel:(+468)-254-762-443">
                                       <i > <FaPhoneAlt/> </i>
                                       (+468) 254 762 443
                                    </a>
                                 </li>
                                 <li>
                                    <a href="mailto:info@consulting.com">
                                       <i > <FaEnvelope/> </i>
                                       info@consulting.com
                                    </a>
                                 </li>
                                 <li>
                                    <a href="#" className="search-toggle">
                                       <i > <FaSearch/> </i>
                                    </a>
                                 </li>
                              </ul>
                           </div>
                        </div> */}
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
                             <NavLink to="/homeexpert">Home</NavLink>
                           </li>
                           </IsExpertSmallComponent> 
                           <li>
                           <NavLink to="/">Home</NavLink>
                           </li>
                           <li>
                             <NavLink to="/about">About Us </NavLink>
                           </li>
                           <li>
                             <NavLink to="/fields">Fields</NavLink>
                           </li>
                           <li>
                             <NavLink to="/contact">Contact Us</NavLink>
                           </li>
                           <IsNotAuthenticatedSmallComponent>
                             <li>
                               <NavLink to="/login">Login</NavLink>
                             </li>
                           </IsNotAuthenticatedSmallComponent>
                         </ul>
                       </nav>
                     </div>
                     <div className="header__btn d-none d-sm-block d-lg-none d-xl-block ml-50">
                       <Link to="/contact" className="z-btn z-btn-white">
                         Book Now
                       </Link>
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