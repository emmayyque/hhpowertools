import React, { useEffect, useState } from 'react'
import CustomerContext from './CustomerContext'

const CustomerState = (props) => {
    const baseUrl = import.meta.env.VITE_JSON_SERVER_URL
    const [ customers, setCustomers ] = useState([])
    const [ filterCustomers, setFilterCustomers ] = useState([])

    useEffect(() => {
        fetch(`${baseUrl}/customers`)
        .then( res => res.json() )
        .then( data => {
          setCustomers(data)
          setFilterCustomers(data)
        })
        .catch( err => console.log(err) )
    }, [])


    const loadCustomers = () => {
        fetch(`${baseUrl}/customers`)
        .then( res => res.json() )
        .then( data => setCustomers(data) )
        .catch( err => console.log(err) )
    }

  return (
    <CustomerContext.Provider value={{ customers, setCustomers, loadCustomers, filterCustomers, setFilterCustomers}}>
        {props.children}
    </CustomerContext.Provider>
  )
}

export default CustomerState
