import React, { useState } from 'react'
import { useEffect } from 'react'
import * as Icons from 'react-icons/fa6'
const baseURL = import.meta.env.VITE_NODE_URL

const Addresses = () => {

  const removeAddressHandler = async (e) => {
    let addressId = e.target.closest('.actions').id
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${baseURL}/api/address/deleteaddress/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type" : "application/json",
          "auth-token": token
        }
      })
  
      const json = await resp.json()
      if ( json.success ) { 
        setResponse({
          message: json.message
        })
        getUserAddresses();
      } else {
        setResponse({
          error: json.error
        })
      }

      setTimeout(() => {
        setResponse({})
      }, 4000)
    }
  }

  const [ addresses, setAddresses ] = useState([])

  useEffect(() => {
    getUserAddresses()
  }, [])

  const getUserAddresses = async ()  => {
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${baseURL}/api/address/getallbycustomer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })

      const json = await resp.json()

      if (json.success) {
        setAddresses(json.data)
      } else {
        console.log(json.error)
      }
    }
  }

  const [ response, setResponse ] = useState({})
  
  return (
    <div className='addresses'>
      { response.errors && <div className='alertError'>{response.errors}</div> }
      { response.error && <div className='alertError'>{response.error}</div> }
      { response.message && <div className='alertSuccess'>{response.message}</div> }
      {
        addresses.length === 0 ? 'No addresses found...' : 
        addresses.map((address, index) => (
          <div className="address-item row space-between" key={index}>
            <div className='address-item-details column align-start gap1'>
              <p className='values row align-start gap1'><span className='labels'>Name: </span>{ address.customer.firstName + ' ' + address.customer.lastName }</p>
              <p className='values row align-start gap1'><span className='labels'>Street: </span>{ address.street }</p>
              <p className='values row align-start gap1'><span className='labels'>Area: </span>{ address.area }</p>
              <p className='values row align-start gap1'><span className='labels'>City: </span>{ address.city }</p>
              <p className='values row align-start gap1'><span className='labels'>State: </span>{ address.state }</p>
              <p className='values row align-start gap1'><span className='labels'>Zip Code: </span>{ address.zipCode }</p>
            </div>
            <div className='actions row' onClick={removeAddressHandler} id={address._id}>
              <Icons.FaXmark  className=''/>                
            </div>
        </div>
        ))
      }
    </div>
  )
}

export default Addresses
