import React from 'react';
import { FaEnvelope, FaFacebookF, FaPhoneAlt, FaTwitter, FaVimeoV } from 'react-icons/fa';
import { BiMap } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Footer = () => {
   return (
      <>
         <footer>
               <div className="footer__copyright">
                  <div className="container">      
                           <div className="footer__copyright-text text-center">
                              <p>Copyright © 2023 FindExpert All Rights Reserved </p>
                     </div>
                  </div>
            </div>
         </footer>
      </>
   );
};

export default Footer;