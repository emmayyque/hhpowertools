import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import * as Icons from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import CartContext from '../../context/cart/CartContext'

const baseURL = import.meta.env.VITE_NODE_URL

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
        
        let itemWeight = Number(props.product.weight.split(" ")[0])
        let weightUnit = props.product.weight.split(" ")[1]

        if (weightUnit == 'g') {
            itemWeight /= 1000
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || []
        let cartItem = {
            id: `${props.product._id}`,
            name: props.product.name,
            imageUrl: baseURL + props.product.images[0].imageUrl,
            price: getDiscountedPrice(props.product.costPrice, props.product.discount),
            quantity: 1,
            weight: itemWeight            
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
        }, 3000);
    }, [response])


    setTimeout(() => {
        setIsLoading(false)
    }, 50);

    const buyNowHandler = (e) => {
        e.preventDefault()
        addToCartHandler()
        navigate('/shop/checkout')
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
