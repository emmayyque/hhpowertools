import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import * as Icons from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import ProductContext from '../../context/products/ProductContext';
import CartContext from '../../context/cart/CartContext';
const baseURL = import.meta.env.VITE_NODE_URL

const ProductCard = (props) => {
    const cartData = useContext(CartContext)
    const navigate = useNavigate()

    const [ response, setResponse ] = useState({})
    const getFormat = (value) => {
        return (
            (value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )
    }

    const getDiscountedPrice = (costPrice, discount) => {
        let discVal = (costPrice * discount) / 100
        return (
            costPrice - discVal
        )
    }  

    const addToCartHandler = (e) => {
        e.preventDefault()
        let cart = JSON.parse(localStorage.getItem("cart")) || []
        
        let cartItem = {
            id: `${props.product._id}`,
            name: props.product.name,
            imageUrl: baseURL + props.product.images[0].imageUrl,
            price: getDiscountedPrice(props.product.costPrice, props.product.discount),
            quantity: 1
        }

        cart.push(cartItem)

        cartData.addToCart(cart)

        setResponse({
            status: 'success',
            msg: 'Item Added To The Cart'
        })

        // document.location.reload()
    }

    useEffect(() => {
        setTimeout(() => {
            setResponse({})
        }, 8000);
    }, [])


    // const productViewHandler = (e) => {
    //     e.preventDefault()
    //     localStorage.setItem("id", JSON.stringify(e.target.id))
    //     navigate(`/Shop/Product/${e.target.name}`)
    // }

  return (
    <div className="product-card">
        {
            response && (
                response.status == 'success' ? 
                <div className="alert-success">
                    { response.msg }
                </div> : response.status == 'error' ? 
                <div className="alert-error">
                    { response.msg }
                </div> : ''
            )
        }
        <div className="card-image">
            {
                props.product.averageRating && <span className="tag">Best Selling</span>
            }
            <Link to={`/shop/product/${props.product.name.split(" ").join("-")}`}><img src={ `${baseURL}${props.product.images[0].imageUrl}` } alt={props.product.name} /></Link>
            {
                props.product.discount > 0 ? 
                <span className='offer'>{ props.product.discount }% Off</span> :
                ''
            }
        </div>
        <div className="card-body">
            <h3><Link to={`/shop/product/${props.product.name.split(" ").join("-")}`}>{ props.product.name.split(" ").slice(0, 6).join(" ") } ...</Link></h3>
            <div className='row'>
                <div className="prices">
                    {
                        props.product.discount > 0 ?
                        <>
                            <h4 className='actual-price'>
                                Rs. { getFormat( getDiscountedPrice(props.product.costPrice, props.product.discount) ) }
                            </h4>
                            <h4 className='cut-price'>Rs. { getFormat(props.product.costPrice) }</h4>
                        </> :
                        <h4 className='actual-price'>Rs. { getFormat(props.product.costPrice) }</h4>
                    }
                </div>
                <div className="card-actions column gap0">
                    {
                        props.product.quantity > 0 ? 
                        <a href="" className='btn2 row gap1' onClick={addToCartHandler}>
                            <Icons.FaBagShopping />
                            Add To Cart
                        </a> : <p>Out of stock</p>
                    }
                    {/* <a href="" className='btn3 row gap1'>
                        
                    </a> */}
                    <Link to={`/shop/product/${props.product.name.split(" ").join("-")}`} className='btn3 row gap1' id={`${props.product._id}`}> 
                        <Icons.FaBagShopping />
                        Buy Now
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductCard
