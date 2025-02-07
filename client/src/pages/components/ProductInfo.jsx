import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import * as Icons from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import ProductContext from '../../context/products/ProductContext'
import CartContext from '../../context/cart/CartContext'

const ProductInfo = (props) => {
    const cartData = useContext(CartContext)

    const navigate = useNavigate()
    const [ isLoading, setIsLoading ] = useState(true)
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
        if (e) {
            e.preventDefault()
        }
        
        let cart = JSON.parse(localStorage.getItem("cart")) || []
        let cartItem = {
            id: `${prodData.product[0].id}`,
            name: prodData.product[0].name,
            image_url: prodData.product[0].images[0].image_url,
            price: getDiscountedPrice(),
            quantity: 1
        }

        cart.push(cartItem)
        cartData.addToCart(cart)

        setResponse({
            status: 'success',
            msg: 'Item Added To The Cart'
        })
    }

    useEffect(() => {
        setTimeout(() => {
            setResponse({})
            }, 5000);
    }, [])


    setTimeout(() => {
        setIsLoading(false)
    }, 50);

    const buyNowHandler = (e) => {
        e.preventDefault()
        addToCartHandler()
        navigate('/Shop/Checkout')
        window.location.reload();
    }

  return (
    isLoading ? '' :
    <div className='product-info column gap1'>
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
        <h2>{ props.product.name }</h2>
        {
            props.product.quantity > 5 ? <p>Availability: <span>{ props.product.quantity } in stock</span></p> :
            props.product.quantity < 1 ? <p className='form-field-error'>Out of Stock</p> :
            props.product.quantity <= 5 ? <p>Availability: <span>{ props.product.quantity } in stock (Low on Stock)</span></p> : ''
        }
        <div className="divider-1"></div>
        <p>
            <pre>{ props.product.description }</pre>
        </p>
        <div className="specs">
            {
                props.specifications.length === 0 ? '' :
                props.specifications.map((specification, index) => (
                    <p key={index}><span className="label">{specification.name}: </span>{specification.value}</p>
                ))
            }
        </div>
        <div className="divider-1"></div>
        <div className='prices row gap2'>
            {
                props.product.discount > 0 ? 
                <>
                    <h4 className="actual-price">Rs. { getFormat( getDiscountedPrice(props.product.costPrice, props.product.discount)) }</h4>
                    <h4 className="cut-price">Rs. { getFormat( props.product.costPrice ) }</h4>
                </> :
                <>
                    <h4 className="actual-price">Rs. { getFormat( props.product.costPrice ) }</h4>
                </>
            }
        </div>
        <div className="product-actions row gap2">
            {
                props.product.quantity > 0 ? 
                <>
                    <a href="" className='btn2 row gap0' onClick={addToCartHandler}>
                        <Icons.FaBagShopping className='icon'/>
                        Add To Cart
                    </a>
                    <a href="" className='btn3 row gap0' onClick={buyNowHandler}>
                        <Icons.FaBagShopping className='icon'/>
                        Buy Now
                    </a>
                </> : <p className='form-field-error'>Out of Stock</p>
            }
        </div>
    </div>
  )
}

export default ProductInfo
