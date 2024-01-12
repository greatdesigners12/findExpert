import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList,
    FaMoneyCheck,
    FaMoneyBill,
    FaDollarSign
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import "./sidebar.css";

const SidebarAdmin = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:"/admin-withdraw-requests",
            name:"Withdraw Requests",
            icon:<FaMoneyBill/>
        },
        {
            path:"/admin-expert-verifications",
            name:"Expert Verification",
            icon:<FaUserAlt/>
        },
        {
            path:"/admin-payment-verifications",
            name:"Payment Verification",
            icon:<FaDollarSign/>
        },
        {
            path:"/admin-transactions",
            name:"All Transactions",
            icon:<FaMoneyCheck/>
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