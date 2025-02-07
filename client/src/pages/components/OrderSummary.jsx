import React, { useEffect } from 'react'
import { useContext } from 'react'
import * as Icons from 'react-icons/fa6'
import CartContext from '../../context/cart/CartContext'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const baseURL = import.meta.env.VITE_NODE_URL

const OrderSummary = ({ billing }) => {
    const { shippingCost, cartItems, setCartItems } = useContext(CartContext)
    const navigate = useNavigate()

    const getFormat = (value) => {
        return (
            (value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )
    }
    
    const getTotal = () => {
        let total = 0
        
        for (let i = 0; i < cartItems.length; i++ ) {
            total += (cartItems[i].price * cartItems[i].quantity)
        }

        return total
    }
    
    const orderTotal = () => {
        let total = 0
        total += getTotal()
        total += shippingCost

        return total
    }

    const [ orderItems, setOrderItems ] = useState([])
    const [ isSubmit, setIsSubmit ] = useState(false)
    const [ response, setResponse ] = useState({})

    useEffect(() => {
        if (cartItems.length > 0) {
            const updatedOrderItems = cartItems.map((item) => ({
                product: item.id,
                quantity: item.quantity
            }))

            setOrderItems(updatedOrderItems)
        }
    }, [cartItems])


    const orderAsGuest = async () => {
        const resp = await fetch(`${baseURL}/api/order/orderAsGuest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: billing.formValues.firstName,
                lastName: billing.formValues.lastName,
                email: billing.formValues.email,
                street: billing.formValues.street,
                area: billing.formValues.area,
                city: billing.formValues.city,
                state: billing.formValues.state,
                zipCode: billing.formValues.zipCode,
                orderItems: orderItems,
                shippingCost: data.shippingCost,
                totalBill: getTotal()
            })
        })

        const json = await resp.json()

        if (json.success) {
            setResponse({ orderNo: json.orderNo })
            clearCart()
            billing.setFormValues({...billing.initialValues})
        } else {
            setResponse({ error: json.error })
            
            setTimeout(() => {
                setResponse({})
            }, 4000);
        }
    }

    const orderAsCustomerWithNewAddress = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/orderAsCustomerWithNewAddress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({
                    street: billing.formValues.street,
                    area: billing.formValues.area,
                    city: billing.formValues.city,
                    state: billing.formValues.state,
                    zipCode: billing.formValues.zipCode,
                    orderItems: orderItems,
                    shippingCost: shippingCost,
                    totalBill: getTotal()
                })
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({ orderNo: json.orderNo })
                clearCart()
                billing.setFormValues({...billing.initialValues})
            } else {
                setResponse({ error: json.error })
                
                setTimeout(() => {
                    setResponse({})
                }, 4000);
            }
        }
    }

    const orderAsCustomer = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/orderAsCustomer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({
                    address: billing.selectedAddress,
                    orderItems: orderItems,
                    shippingCost: shippingCost,
                    totalBill: getTotal()
                })
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({ orderNo: json.orderNo })
                clearCart()
                billing.setFormValues({...billing.initialValues})
            } else {
                setResponse({ error: json.error })
                
                setTimeout(() => {
                    setResponse({})
                }, 4000);
            }
        }
    }

    useEffect(() => {
        if (billing.isBillingDetails) {
            if (Object.keys(billing.formErrors).length === 0 && isSubmit) {
                if (billing.isGuest) {
                    orderAsGuest()
                } else {
                    orderAsCustomerWithNewAddress()
                }

                clearCart()
            }
        }
    }, [billing.formErrors])

    const placeOrderHandler = async (e) => {
        e.preventDefault()
        if ( orderItems.length > 0 && billing.isBillingDetails ) {
            billing.setFormErrors(validate(billing.formValues))
            setIsSubmit(true)
        } else if (!billing.isBillingDetails) {
            if (billing.selectedAddress) {
                orderAsCustomer()

                clearCart()
            } else {
                setResponse({
                    error: "Please select an address first"
                })

                setTimeout(() => {
                    setResponse({})
                }, 4000);
            }
        } else if ( orderItems.length === 0) {
            setResponse({ 
                error: "Your cart is empty !!"
            })
            
            setTimeout(() => {
                setResponse({})
            }, 4000);
        }
    }

    const validate = (values) => {
        const errors = {}

        if (!values.firstName) {
            errors.firstName = 'First name is required'
        }

        if (!values.lastName) {
            errors.lastName = 'Last name is required'
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!values.email) {
            errors.email = 'Email is required'
        } else if (!emailRegex.test(values.email)) {
            errors.email = 'Enter a valid email address'
        }

        if (!values.phone) {
            errors.phone = 'Phone No is required'
        }

        if (!values.street) {
            errors.street = 'Street address is required'
        }

        if (!values.area) {
            errors.area = 'Area is required'
        }

        if (!values.city) {
            errors.city = 'City is required'
        }

        if (values.state == 0) {
            errors.state = 'State must be selected'
        }

        return errors
    }

    const cancelHandler = (e) => {
        e.preventDefault()
        clearCart()
        navigate('/')
    }

    const clearCart = () => {
        localStorage.removeItem("cart")
        setCartItems([])
    }

  return (
    <div className='order-summary summary'>
        { response.errors && <div className='alertError'>{response.errors}</div> }
        { response.error && <div className='alertError'>{response.error}</div> }
        {/* { response.message && <div className='alertSuccess'>{response.message}</div> } */}
        { response.orderNo && 
            <div className="overlay">
                <div className="modal">
                    <h3 className="page-heading">Order Booked Successfully!</h3>
                    <hr />
                    <p>You can track your <span className='orderNo'>Order-{response.orderNo}</span> status at <Link to={"/Tracking"}>http://localhost:5173/Tracking</Link></p>
                    <Link to={"/"} className='btn2' onClick={cancelHandler}>Cancel</Link>
                </div>
            </div>
        }
        
        <div className="s-item row">
            <span>Products</span>
            <span>Sub Total</span>
        </div>
        {
            cartItems && (cartItems).map((item, index) => (
                <div className="s-item row gap2" key={index}>
                    <p>{item.name} <span>x {item.quantity}</span></p>
                    <p>{ getFormat(item.price * item.quantity) } Rs.</p>
                </div>
            ))
        }
        <div className="s-item row">
            <span>Sub Total</span>
            { getFormat(getTotal()) } Rs.
        </div>
        <div className="s-item row">
            <span>Payment Method</span>
            Cash On Delivery
        </div>  
        <div className="s-item row">
            <span>Shipping Cost</span>
            { getFormat(shippingCost) } Rs.
        </div>        
        <div className="s-total row">
            <span>Total Order Bill</span>
            { getFormat(orderTotal()) } Rs.
        </div>
        <a href="" className='btn2 row gap1' onClick={ placeOrderHandler } >
            Place Order
            <Icons.FaChevronRight />
        </a>
    </div>
  )
}

export default OrderSummary
