import React, { useEffect, useState } from 'react'
import SectionLabel from './SectionLabel'
import ProductCard from './ProductCard'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

const baseURL = import.meta.env.VITE_NODE_URL

const ProductSection = (props) => {
    const [ products, setProducts ] = useState([])

    useEffect(() => {
        if (props.label == 'Top Rated Products') {
            getTopRatedProducts()
        } else {
            getProductsByCategoryName(props.label)
        }
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


  return (
    <div className="product-section">
        <SectionLabel heading={props.label} option={props.option} />
        <div className="products-area row">
            {
                products.length === 0 ? '' :
                products && products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))
            }
        </div>
    </div>
  )
}

export default ProductSection
