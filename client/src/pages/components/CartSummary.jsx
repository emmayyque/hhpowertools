import React, { useContext, useEffect, useState } from 'react'
import * as Icons from 'react-icons/fa6'
import CartContext from '../../context/cart/CartContext'
import { useNavigate } from 'react-router-dom'
const baseURL = import.meta.env.VITE_NODE_URL

const CartSummary = (props) => {
    
    const getRegions = async () => {
        const resp = await fetch(`${baseURL}/api/shippingfee/getall`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
        })
        const json = await resp.json()

        if (json.success) {
            setStates(json.data)
        } else {
            console.log(json.error)
        }
    }

    const data = useContext(CartContext)
    const [ response, setResponse ] = useState({})
    const [ isLoading, setIsLoading ] = useState([])
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
        
        for (let i = 0; i < data.cartItems.length; i++ ) {
            total += (data.cartItems[i].price * data.cartItems[i].quantity)
        }

        return total
    }

    const getCartTotal = () => {
        let total = getTotal()
        total += data.regionFee + data.weightFee
        return total
    }

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 50);
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setResponse({})
          }, 4000);
    }, [])


    const navigate = useNavigate();

    const checkoutClickHandler = (e) => {
        e.preventDefault()
        if (getTotal() > 0) {
            navigate('/shop/checkout')
        } else {
            setResponse({
                status: 'error',
                msg: 'Cart is empty'
            })
        }
    }

    const [ states, setStates ] = useState([]);

    useEffect(() => {
        getRegions()
    }, [])


    const [ customStyle, setCustomStyle ] = useState({
        transform: "translateY(-65px)", 
        opacity: 0
    })

    const getShipEstimateHandler = () => {
        setCustomStyle({
            transform: "translateY(0)", 
            opacity: 1
        })
    }

    const initialValues = { state: '' }
    const [ formValues, setFormValues ] = useState({...initialValues})
    const inputHandler = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setFormValues({...formValues, [name]: value})
    }
    
    
    useEffect(() => {
        data.getTotalWeight()
        if (formValues.state != '') {
            data.getRegionFeeById(formValues.state)
        } else if (formValues.state == '') {
            data.setRegionFee(0)
        }
    }, [data.cartItems, formValues])

  return (
    isLoading ? '' :
    <div className='cart-summary summary'>
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
      <div className="s-item row gap2">
        <span>Sub Total</span>
        { getFormat(getTotal()) } Rs.
      </div>
      <div className="s-item row">
        <span>
            Shipping Cost
            <div>
                <p onClick={getShipEstimateHandler}>Get Shipping Estimate +</p>
                <form action="" style={customStyle}>
                    <select name="state" id="state" defaultValue={0} onChange={inputHandler} >
                        <option value="0" disabled>Select State</option>
                        {
                            states && states.map((state, index) => (
                                <option value={state._id} key={index}>{state.region}</option>
                            )) 
                        }
                    </select>
                </form>
            </div>
        </span>
        { getFormat(data.regionFee + data.weightFee) } Rs.
      </div>
      <div className="s-total row">
        <span>Total</span>
        { getFormat(getCartTotal()) } Rs.
      </div>
      <a href="" className='btn2 row gap1' onClick={checkoutClickHandler}>
        Proceed to Checkout
        <Icons.FaChevronRight />
      </a>
    </div>
  )
}

export default CartSummary
