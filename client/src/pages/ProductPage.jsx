import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import Header from './components/Header'
import Footer from './components/Footer'
import ProductGallery from './components/ProductGallery'
import ProductInfo from './components/ProductInfo'
import Panel from './components/Panel'
import { useContext } from 'react'
import ProductContext from '../context/products/ProductContext'
import { useParams } from 'react-router-dom'
const baseURL = import.meta.env.VITE_NODE_URL

const ProductPage = () => {
  const [ isLoading, setIsLoading ] = useState(true)
  const [ product, setProduct ] = useState([])
  const [ specifications, setSpecification ] = useState([])
  const params = useParams()

  const [ currentSection, setCurrentSection ] = useState("Description")
  const toCapitalCase = (sentence) => {
    return sentence
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
  useEffect(() => {

    let prodName = params.prodName.split("-").join(" ")
    getProductByName(prodName)
    getTopRatedProducts()
    document.title = `HH Power Tools | ${ prodName }`
  }, [params.prodName])


  const [ topRatedProducts, setTopRatedProducts ] = useState([])  

  const options = [
      { label: 'View All', value: ''}
  ]

  const nav = [
    { label: 'Description' },
    { label: 'Specifications' },
    { label: 'Reviews' },
  ]

  const getProductByName = async (name) => {
    const resp = await fetch(`${baseURL}/api/product/getonebyname/${name}`, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
      }
    })

    const json = await resp.json()
    
    if (json.success) {
      setProduct(json.data.product)
      setSpecification(json.data.specifications)
    } else {
      console.log(json.error)
    }
  }

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
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }, [])


  return (
    isLoading ? '' :
    <>
      <Header />        
      <div className="product-page">
        { 
          product.length === 0 ? '' :
          <>
            <Helmet>
              <meta property="og:title" content={product.name} />
              <meta property="og:description" content={product.description} />
              <meta property="og:image:secure_url" content={baseURL + product.images[0].imageUrl} />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              <meta property="og:url" content={baseURL + '/shop/product/' + product.name.split(" ").join("-")} />
              <meta property="og:type" content="website" />
              {/* Optional for Twitter card */}
              <meta name="twitter:card" content={product.description} />
              <meta name="twitter:image" content={baseURL + product.images[0].imageUrl} />
            </Helmet>
            <div className="product-section-1 row gap2">
              <ProductGallery product={ product } />
              <ProductInfo product={ product } specifications={ specifications } />
            </div>
            <div className="product-section-2 row gap2">
              <div className="main">
                <Panel nav={nav} currentSection={currentSection} setCurrentSection={setCurrentSection} product={product} specifications={specifications} />
              </div>
              <div className="side">
                <Panel title="Top Rated Products" option={options} data={topRatedProducts} />
              </div>
            </div>
          </>            
        }
      </div>
      <Footer />
    </>
  )
}

export default ProductPage
