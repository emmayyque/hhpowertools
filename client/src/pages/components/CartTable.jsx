import React, { useEffect, useState } from 'react'
import * as Icons from 'react-icons/fa6'
import Image from '../../../public/images/products/hardware-tools/prod1.jpg'
import { useContext } from 'react'
import CartContext from '../../context/cart/CartContext'

const CartTable = (props) => {
    const cartData = useContext(CartContext)
    const [ response, setResponse ] = useState({})
    const getFormat = (value) => {
        return (
            (value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )
    }

    const removeFromCartHandler = (e) => {
        let itemId = e.target.closest(".action").id
        cartData.removeFromCart(itemId)

        setResponse({
            status: 'success',
            msg: 'Item Removed From Cart'
        })
        
        // document.location.reload();
    }

    const quantityIncrementHandler = (e) => {
        let itemId = e.target.closest(".quantity").id
        cartData.incQuantity(itemId)

        setResponse({
            status: 'success',
            msg: 'Item Quantity Incresed'
        })
        // document.location.reload();
    }

    const quantityDecrementHandler = (e) => {
        let itemId = e.target.closest(".quantity").id
        let input = e.target.closest('.quantity').childNodes[1]
        
        if (input.value > 1) {
            cartData.decQuantity(itemId)
            setResponse({
                status: 'success',
                msg: 'Item Quantity Decresed'
            })
        }
        // document.location.reload();
    }

    setTimeout(() => {
        setResponse({})
    }, 3000);

  return (
    <>
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
        <div className='cart-table table column'>
            {
                cartData.cartItems && cartData.cartItems.length > 0 ? 
                (
                    (cartData.cartItems).map((item, index) => (
                        <div className="cart-item row gap1 align-start space-between" key={index}>
                            <div className="cart-item-body row gap1">
                                <div className="cart-image row">
                                    <img src={`${ item.imageUrl }`} alt="" />
                                </div>
                                <div className="cart-item-details column align-start space-between">
                                    <h2>{ item.name }</h2>
                                    <div className="row">
                                        <div className="">
                                            <p><span>Unit Price: </span>{ getFormat(item.price) } Rs</p>
                                            <p><span>Total Price: </span>{ getFormat(item.price * item.quantity) } Rs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column align-end space-between">
                                <div className="action row" onClick={removeFromCartHandler} id={`${item.id}`}>
                                    <Icons.FaXmark />
                                </div>
                                <div className="quantity row" id={`${item.id}`}>
                                    <span className='row' onClick={quantityDecrementHandler} ><Icons.FaMinus /></span>
                                    <input type="number" min={1} value={item.quantity}/>
                                    <span className='row' onClick={quantityIncrementHandler} ><Icons.FaPlus /></span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : 
                <p>Your cart is empty.. Continue Shopping</p>
            } 
        </div>
    </>
  )
}

export default CartTable
