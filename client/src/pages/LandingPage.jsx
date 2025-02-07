import React, { useContext, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroBanner from './components/HeroBanner'
import CategoriesPanel from './components/CategoriesPanel'
import ProductSection from './components/ProductSection'
import Area from './components/Area'
import Banner1 from './components/Banner1'
import { useState } from 'react'
import Loader from './components/Loader'
import CategoryContext from '../context/categories/CategoryContext'
import gsap from 'gsap'
import { Helmet } from 'react-helmet'

const baseUrl = import.meta.env.VITE_JSON_SERVER_URL

const LandingPage = () => {
    const catData = useContext(CategoryContext)    


    const [ powerTools, setPowerTools ] = useState([])
    const [ hardwareTools, setHardwareTools ] = useState([])

    

    const options = [
        { label: 'View All', value: 1 },
        { label: 'View All', value: 2 },
        { label: 'View All', value: 3 }
    ]

    // useEffect(() => {
    //     fetch(`${baseUrl}/products?category=1&_limit=4&rating_gte=4`)
    //     .then( res => res.json() )
    //     .then( data => setPowerTools(data) )
    //     .catch( err => console.log(err) )
    // }, [])

    // useEffect(() => {
    //     fetch(`${baseUrl}/products?category=2&_limit=4&rating_gte=3`)
    //     .then( res => res.json() )
    //     .then( data => setHardwareTools(data) )
    //     .catch( err => console.log(err) )
    // }, [])

    const [isLoading, setIsLoading] = useState(true)
    setTimeout(() => {
        setIsLoading(false)
    }, 50)

    let timeline = gsap.timeline()

  return (
    isLoading ? '' :
    <>  
        <Helmet>
            <title>HH Power Tools</title>
        </Helmet>
        <Header  />
        <HeroBanner />    
        <CategoriesPanel />
        {
            catData.categories.length === 0 ? '' :
            <>
                <ProductSection label={catData.categories[0].name} option={options[0]} />
                <ProductSection label={catData.categories[1].name} option={options[1]} />
            </>

        }
        <Banner1 />
        <ProductSection label="Top Rated Products" option={options[2]} />
        <Footer />
    </>
  )
}

export default LandingPage
