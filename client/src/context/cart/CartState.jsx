import React, { useEffect, useState } from 'react'
import CartContext from './CartContext'
const baseURL = import.meta.env.VITE_NODE_URL

const CartState = (props) => {  
    const [ shippingCost, setShippingCost ] = useState(0)
    const [ weightFee, setWeightFee ] = useState(0)
    const [ regionFee, setRegionFee ] = useState(0)
    const [ netWeight, setNetWeight ] = useState(0)
    const [ cartItems, setCartItems ] = useState([])

    const addToCart = (cart) => {
      setCartItems(cart)
      localStorage.setItem("cart", JSON.stringify(cart))
    }

    const getTotalWeight = () => {
      let totalWeight = 0
      cartItems.forEach(item => {
        totalWeight += item.weight * item.quantity; // Weight in KGs
      });
      setNetWeight(totalWeight)
      getWeightFee(totalWeight)
    }

    const getWeightFee = async (netWeight) => {
      let range = ""
      if (netWeight < 0.5) {
          range = "< than 500 grams"
      } else if (netWeight >= 0.5 && netWeight < 1) {
          range = "500 to 999 grams"
      } else if (netWeight >= 1 && netWeight < 2) {
          range = "1kg to 1.9kg"
      } else if (netWeight >= 2 && netWeight < 3) {
          range = "2kg to 2.9kg"
      } else if (netWeight >= 3 && netWeight < 5) {
          range = "3kg to 4.9kg"
      } else if (netWeight >= 5 ) {
          range = "5kg and >"
      }

      if (netWeight != 0) {
        const resp = await fetch(`${baseURL}/api/weightfee/getonebyrange/${range}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        const json = await resp.json();

        if (json.success) {
            setWeightFee(json.data.fee)
        } else {
            console.log(json.error)
        }
      } else {
        setWeightFee(0)
      }
    }

    const removeFromCart = (id) => {
      let filteredCart = cartItems.filter(item => item.id !== id)
      setCartItems(filteredCart)
      localStorage.setItem("cart", JSON.stringify(filteredCart))
    }

    const incQuantity = (id) => {
      let filteredCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1} : item
      )
      setCartItems(filteredCart)
      localStorage.setItem("cart", JSON.stringify(filteredCart))
    }

    const decQuantity = (id) => {
      let filteredCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - 1} : item
      )
      setCartItems(filteredCart)
      localStorage.setItem("cart", JSON.stringify(filteredCart))
    }

    const getRegionFeeById = async (id) => {
        const resp = await fetch(`${baseURL}/api/shippingfee/getone/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await resp.json()

        if (json.success) {
          setRegionFee(json.data.fee)
        } else {
          console.log(json.error)
        }
    }

    const getRegionFeeByRegion = async (region) => {
      const resp = await fetch(`${baseURL}/api/shippingfee/getonebyregion/${region}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      })

      const json = await resp.json()

      if (json.success) {
        setRegionFee(json.data.fee)
      } else {
        console.log(json.error)
      }
    }

    useEffect(() => {
        setCartItems(JSON.parse(localStorage.getItem("cart")) || [])
    }, [])
  return (
    <CartContext.Provider value={{ cartItems, setCartItems, shippingCost, setShippingCost, addToCart, removeFromCart, incQuantity, decQuantity, weightFee, setWeightFee, regionFee, setRegionFee, getTotalWeight, getRegionFeeById, getRegionFeeByRegion, getWeightFee }}>
        {props.children}
    </CartContext.Provider>
  )
}

export default CartState
