import React, { useEffect } from 'react'
import SectionLabel from './SectionLabel'
import ProductCard from './ProductCard'
import { useState } from 'react'
import Pagination from './Pagination'
import { useContext } from 'react'
import ProductContext from '../../context/products/ProductContext'
import { useParams } from 'react-router-dom'
import Loader from './Loader'
const baseURL = import.meta.env.VITE_NODE_URL

const Store = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const [ products, setProducts ] = useState([])
    const [ sortingFilter, setSortingFilter ] = useState(0)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ prodPerPage, setProdPerPage ] = useState(9)
    const params = useParams()

    const lastProdIndex = currentPage * prodPerPage
    const firstProdIndex = lastProdIndex - prodPerPage
    const currentProducts = products.slice(firstProdIndex, lastProdIndex)

    setTimeout(() => {
      setIsLoading(false)
    }, 1500);

    const toCapitalCase = (sentence) => {
      return sentence
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }


    useEffect(() => {
      if (params.category && sortingFilter == 0) {
        const category = toCapitalCase(params.category)
        getProductsByCategoryName(category)
      } else {
        if (sortingFilter == 0) {
          getProducts()
        } else if (sortingFilter == 1) {
          getSortedByPopularity()
        } else if (sortingFilter == 2) {
          getSortedByAvgRating()
        } else if (sortingFilter == 3) {
          getSortedByLatest()
        } else if (sortingFilter == 4) {
          getSortedByHighToLow()
        } else if (sortingFilter == 5) {
          getSortedByLowToHigh()
        } 
      }
    }, [params, sortingFilter])

    const getProducts = async () => {
      const resp = await fetch(`${baseURL}/api/product/getall`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
  
      const json = await resp.json()
      if (json.success) {
          setProducts(json.data)
      } else {
          console.log(json.error)
      }
    }

    const getProductsByCategoryName = async (name) => {
      const resp = await fetch(`${baseURL}/api/product/getbycategoryname/${name}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
  
      const json = await resp.json()
      if (json.success) {
          setProducts(json.data)
      } else {
          console.log(json.error)
      }
    }

    const getSortedByPopularity = async () => {
      let category = ''
      let url = `${baseURL}/api/product/sortByPopularity`
      if (params.category) {
        const category = toCapitalCase(params.category)
        url = `${url}?category=${category}`
      }

      const resp = await fetch(`${url}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })

      const json = await resp.json()
      if (json.success) {
          setProducts(json.data)
      } else {
          console.log(json.error)
      }
    }

    const getSortedByAvgRating = async () => {
      let category = ''
      let url = `${baseURL}/api/product/sortByAverageRating`
      if (params.category) {
        const category = toCapitalCase(params.category)
        url = `${url}?category=${category}`
      }

      const resp = await fetch(`${url}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })

      const json = await resp.json()
      if (json.success) {
          setProducts(json.data)
      } else {
          console.log(json.error)
      }
    }

    const getSortedByLatest = async () => {
      let category = ''
      let url = `${baseURL}/api/product/sortByLatest`
      if (params.category) {
        const category = toCapitalCase(params.category)
        url = `${url}?category=${category}`
      }

      const resp = await fetch(`${url}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })

      const json = await resp.json()
      if (json.success) {
          setProducts(json.data)
      } else {
          console.log(json.error)
      }
    }

    const getSortedByHighToLow = async () => {
      let category = ''
      let url = `${baseURL}/api/product/sortByHighToLow`
      if (params.category) {
        const category = toCapitalCase(params.category)
        url = `${url}?category=${category}`
      }

      const resp = await fetch(`${url}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })

      const json = await resp.json()
      if (json.success) {
          setProducts(json.data)
      } else {
          console.log(json.error)
      }
    }

    const getSortedByLowToHigh = async () => {
      let category = ''
      let url = `${baseURL}/api/product/sortByLowToHigh`
      if (params.category) {
        const category = toCapitalCase(params.category)
        url = `${url}?category=${category}`
      }

      const resp = await fetch(`${url}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })

      const json = await resp.json()
      if (json.success) {
          setProducts(json.data)
      } else {
          console.log(json.error)
      }
    }


  return (
    isLoading ? <Loader /> :
    <div className='store'>
      <SectionLabel heading="Shop" count={products.length} features={"Yes"} setSortingFilter={setSortingFilter} />
      <div className="products-area row">
        {
            currentProducts && currentProducts.map((item, index) => (
                <ProductCard key={index} product={item}  />
            ))
        }
      </div>
      <p>Showing {currentProducts.length} of {products.length} results</p>
      <Pagination totalProducts={products.length} prodPerPage={prodPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
    </div>
  )
}

export default Store
