import React, { useEffect } from 'react'
import CartContext from '../context/cart/CartContext'
import { useState } from 'react'
import { useContext } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import * as Icons from 'react-icons/fa6'

const baseURL = import.meta.env.VITE_NODE_URL

const Page404 = () => {

    useEffect(() => {
        document.title = "HH Power Tools | 404 Page Not Found"
    }, [])

    return (
        <>
            <Header />
            <div className="page-404">
                <h2 className='page-heading'>404! PAGE NOT FOUND!!</h2>
            </div>
            <Footer />
        </>
    )
}

export default Page404
