import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Panel from './components/Panel'
import { useContext } from 'react'
import UserContext from '../context/user/UserContext'
import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Account = (props) => {
    const [ currentSection, setCurrentSection ] = useState("Orders")
    const nav = [
        { label: 'Orders' },
        { label: 'Addresses' },
        { label: 'Profile' },
        { label: 'Logout' },
    ]

    useEffect(() => {
        setCurrentSection("Orders")
    }, [])


    return (
        <>
            <Header />
            <div className='account'>
                <h2 className="page-heading">My Account</h2>
                <Panel nav={nav} currentSection={currentSection} setCurrentSection={setCurrentSection} />
            </div>
            <Footer />
        </>
    )
}

export default Account
