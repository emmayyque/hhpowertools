import React, { useContext, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Categories from './components/Categories'
import Banner2 from './components/Banner2'
import Store from './components/Store'
import Panel from './components/Panel'
import { useEffect } from 'react'
import { Route, Router, Routes, useLocation, useParams } from 'react-router-dom'
const baseURL = import.meta.env.VITE_NODE_URL

const Shop = () => {
  let params = useParams()
  
  const [ topRatedProducts, setTopRatedProducts ] = useState([])
  const [ showByCategory, setShowByCategory ] = useState(0)
  

  useEffect(() => {
    document.title = "HH Power Tools | Shop"
    getTopRatedProducts()
  }, [])
  

  const getTopRatedProducts = async () => {
    const resp = await fetch(`${baseURL}/api/product/getTopRatedProducts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const json = await resp.json()
    if (json.success) {
        setTopRatedProducts(json.data)
    } else {
        console.log(json.error)
    }
  } 


  const options = [
      { label: 'View All', value: ''}
  ]


  return (
    <>
      <Header />
      <div className="shop row gap2">
        <div className="left column gap2">
          <Categories filter={{showByCategory, setShowByCategory}} />
          <Panel title="Top Rated Products" option={options} data={topRatedProducts}/>
        </div>
        <div className="right column gap2">
          {
            !params.category && <Banner2 />          
          }
          
          <Routes>
            <Route path='/' element={ <Store /> } />
            <Route path='/Category/:name' element={ <Store /> } />
          </Routes>
        </div>
      </div>
    <Footer />        
    </>
  )
}

export default Shop
