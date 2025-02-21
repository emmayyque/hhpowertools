import React from 'react'
import Logo from '../../assets/images/HHPT.png'

const OrderProcessing = () => {

  return (
    <div className='processing column'>
        <img src={Logo} alt="" className='loader-logo'/>
        <p>Placing Order....</p>
    </div>
  )
}

export default OrderProcessing
