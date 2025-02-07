import React from 'react'
import Logo from '../../assets/images/logo3.png'
import * as Icons from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>    
        <div className="footer row">
            <div className='column gap3'>
                <div className="footer-logo">
                    <img src={Logo} alt="" />
                </div>
                <div className="contact row gap1">
                    <Icons.FaPhoneVolume className='icon'/>
                    <div>
                        <p>Got Questions? Call us 24/7</p>
                        <h4>+923489024121</h4>
                    </div>
                </div>
            </div>
            <div className='row gap2'>
                <div className="find-it-first column gap2">
                    <h4>Find it First</h4>
                    <ul>
                        <li><Link to={"/shop"}>Shop</Link></li>
                        <li><Link to={"/login"}>Login</Link></li>
                        <li><Link to={"/about-us"}>About Us</Link></li>
                        <li><Link to={"/contact-us"}>Contact Us</Link></li>                    
                    </ul>
                </div>
                <div className="quick-links column gap2">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to={"/"}>Home</Link></li>
                        <li><Link to={"/shop"}>Shop</Link></li>
                        <li><Link to={"/login"}>Login</Link></li>
                        <li><Link to={"/register"}>Register</Link></li>
                        <li><Link to={"/about-us"}>About Us</Link></li>
                        <li><Link to={"/contact-us"}>Contact Us</Link></li>
                        <li><Link to={"/tracking"}>Track with Us</Link></li>
                    </ul>
                </div>
                <div className="get-in-touch column gap2">
                    <h4>Get In Touch</h4>
                    <div className="row gap0">
                        <a href=""><Icons.FaFacebook className='icon'/></a>
                        <a href=""><Icons.FaWhatsapp className='icon'/></a>
                    </div>
                </div>
            </div>
        </div>     
        <div className="credits">HHPowerTools © 2025, All Rights Reserved</div>
    </>
  )
}

export default Footer
