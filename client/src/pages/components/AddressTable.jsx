import React, { useContext, useState } from 'react'
import CartContext from '../../context/cart/CartContext'
const baseURL = import.meta.env.VITE_NODE_URL

const AddressTable = ({ userAddresses, setSelectedAddress }) => {
    const { shippingCost, setShippingCost } = useContext(CartContext)

    const addressHandler = async (e) => {
        const { name, id, region, value } = e.target
        if (e.target.checked) {
            const resp = await fetch(`${baseURL}/api/shippingfee/getonebyregion/${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const json = await resp.json()
            if (json.success) {
                
                setSelectedAddress(id)
                setShippingCost(json.data.fee)
            } else {
                console.log(json.error)
            }
        }
    }

  return (
    userAddresses.length === 0 ? '' :
    <div className='address-table table'>
        {
            userAddresses.map((address, index) => (
                <div className="address-item row space-between" key={index}>
                    <div className='address-item-details row align-start gap3'>
                        <div className='values column align-start'>
                            <p><span className="labels">Name: </span>{ address.customer && address.customer.firstName + ' ' + address.customer.lastName }</p>
                            <p><span className="labels">Street: </span>{ address.street }</p>
                            <p><span className="labels">Area: </span>{ address.area }</p>
                            <p><span className="labels">City: </span>{ address.city }</p>
                            <p><span className="labels">State: </span>{ address.state }</p>
                            <p><span className="labels">Zip Code: </span>{ address.zipCode && address.zipCode }</p>
                        </div>
                    </div>
                    <div className='actions'>
                        <input type="radio" name={address.state} id={address._id} onChange={addressHandler}/>                
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default AddressTable
