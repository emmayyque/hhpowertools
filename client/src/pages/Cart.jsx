import React, { useContext, useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CartTable from './components/CartTable'
import Panel from './components/Panel'
import CartContext from '../context/cart/CartContext'

const Cart = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const data = useContext(CartContext)

    useEffect(() => {
        document.title = "HH Power Tools | Cart"
        setTimeout(() => {
            setIsLoading(false)
        }, 50);
    }, [])

   


  return (
    isLoading ? '' :
    <>
        <Header />
        <div className="cart">
            <h2 className='page-heading'>Your Shopping Cart</h2>
            <div className="row gap2">
                <CartTable cartItems={data.cartItems} />
                <Panel title="Cart Summary"/>
            </div>
        </div>
        <Footer />
    </>
  )
}

export default Cart
