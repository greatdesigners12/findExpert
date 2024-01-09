import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import "./sidebar.css";

const SidebarAdmin = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:"/",
            name:"Withdraw Verification",
            icon:<FaTh/>
        },
        {
            path:"/about",
            name:"Expert Verification",
            icon:<FaUserAlt/>
        },
        {
            path:"/analytics",
            name:"Payment Verification",
            icon:<FaRegChartBar/>
        },
        {
            path:"/comment",
            name:"All Transactions",
            icon:<FaCommentAlt/>
        },
        
    ]
    return (
        <div className="container-admin">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar-admin">
               <div className="top_section-admin">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo-admin">Logo</h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars-admin">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link-admin" activeclassName="active-admin">
                           <div className="icon-admin">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text-admin">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
    );
};

export default SidebarAdmin;