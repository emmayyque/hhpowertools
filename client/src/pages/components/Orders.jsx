import React from 'react'
import { useState, useEffect } from 'react'
const baseURL = import.meta.env.VITE_NODE_URL

const Orders = () => {

  const getFormat = (value) => {
      return (
          (value).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })
      )
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  const [ orders, setOrders ] = useState([])

  const getUserOrders = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${baseURL}/api/order/getallbycustomer/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      })

      const json = await resp.json()

      if (json.success) {
        setOrders(json.data)
      } else {
        console.log(json.error)
      }
    }
  }

  return (
    <div className='orders'>
      {
        orders.length === 0 ? 'No orders found...' : 
        orders.map(( order, index ) => (
          <div className="item row gap2 align-stretch space-between" key={index}>
            <div className='column gap1 align-start'>
              <p className='values row gap1'><span className='labels'>Order ID:</span>{order.orderNo}</p>
              <p className='values row gap1'><span className='labels'>Shipping Fee:</span>{ getFormat(order.shippingFee) } Rs</p>
              <p className='values row gap1'><span className='labels'>Total Bill:</span>{ getFormat(order.totalBill) } Rs</p>
              <p className='values row gap1'><span className='labels'>Status:</span>{ order.status == 0 ? 'Declined' : order.status == 1 ? 'Pending' : order.status  == 2 ? 'Approved' : order.status  == 3 ? 'Delivered' : ''}</p>
              <p className='values row gap1'><span className='labels'>Order Date:</span>{order.createdAt}</p>
            </div>
            <div className="tab-divider"></div>
            <div className="table-container">
              <table>
                <thead>
                  <tr className='labels'>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    order.orderItems.map((item, index) => (
                      <tr className='values' key={index}>
                        <td>{item.product && item.product.name}</td>
                        <td>{item.quantity}</td>
                        <td>{ item.product && getFormat(item.product.costPrice) } Rs</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        ))
      }      
    </div>
  )
}

export default Orders
