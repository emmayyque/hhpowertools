import React, { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import * as Icons from 'react-icons/fa6'

const baseURL = import.meta.env.VITE_NODE_URL

const ContactUs = () => {

    return (
        <>
            <Header />
            <div className="contact-us">
                <h2 className='page-heading'>Contact Us</h2>
            </div>
            <Footer />
        </>
    )
}

export default ContactUs
