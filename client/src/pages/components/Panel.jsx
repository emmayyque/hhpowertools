import React from 'react'
import SectionLabel from './SectionLabel'
import Image from '../../../public/images/products/hardware-tools/prod1.jpg'
import PanelItem from './PanelItem'
import Specifications from './Specifications'
import Description from './Description'
import Reviews from './Reviews'
import CartSummary from './CartSummary'
import OrderSummary from './OrderSummary'
import Orders from './Orders'
import Addresses from './Addresses'
import Profile from './Profile'
import BillingDetails from './BillingDetails'

const Panel = (props) => {

  return (
    <div className='panel'>
        {
          props.title && (
            <SectionLabel heading={props.title} option={props.option} />
          )
        }
        {
          props.nav && (
            <SectionLabel heading={props.title} option={props.option} nav={props.nav} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} />
          )
        }
        <div className="panel-body">
            {
                props.data && props.data.map((item, index) => (
                  <PanelItem key={index} id={item.id} name={item.name} discount={item.discount} tag={item.tag} costPrice={item.costPrice} image={item.images[0].imageUrl} />
                ))
            }
            {
              props.product && (
                props.currentSection == 'Description' ?
                <Description product={props.product} /> : props.currentSection == 'Specifications' ?
                <Specifications specifications={props.specifications} /> : props.currentSection == 'Reviews' ?
                <Reviews productId={props.product._id} /> : ''
              )
            }
            {
              props.title == 'Cart Summary' ? 
              <CartSummary cartItems={props.cartItems} />
              : ''
            }
            {
              props.title == 'Order Summary' ? 
              <OrderSummary billing={ props.billing } />
              : ''
            }
            {
              props.title == 'Billing Details' ? 
              <BillingDetails billing={ props.billing } />
              : ''
            }
            {
              props.currentSection == 'Orders' ?
              <Orders /> : props.currentSection == 'Addresses' ?
              <Addresses /> : props.currentSection == 'Profile' ?
              <Profile /> : ''
            }
        </div>
    </div>
  )
}

export default Panel
