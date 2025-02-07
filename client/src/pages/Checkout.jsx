import React, { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AddressTable from './components/AddressTable'
import BillingDetails from './components/BillingDetails'
import { useState } from 'react'
import Panel from './components/Panel'
const baseURL = import.meta.env.VITE_NODE_URL

const Checkout = () => {
    const [ isGuest, setIsGuest ] = useState(false)
    const [ userAddresses, setUserAddresses ] = useState([])
    const [ selectedAddress, setSelectedAddress ] = useState(null)
    const [ isBillingDetails, setIsBillingDetails ] = useState(false)
    const token = localStorage.getItem("token")

    useEffect(() => {
        document.title = "HH Power Tools | Checkout"
        
        if (!token) {
            setStyle({ opacity: 1, display: 'block', transform: 'translateY(0)' })
            setIsBillingDetails(true)
            setIsGuest(true)
        }
        
    }, [])

    useEffect(() => {
        getUserAddresses()
    }, [])

    const getUserAddresses = async () => {
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
                if (json.data.length == 0) {
                    setIsBillingDetails(true)
                    setStyle({ opacity: 1, display: 'block', transform: 'translateY(0)' })
                }
                setUserAddresses(json.data)
            } else {
                console.log(json.error)
            }
        }
    }

    const [ style, setStyle ] = useState({ opacity: 0, display: 'none', transform: 'translateY(-100%)' })

    const differentAddressHandler = (e) => {
        if (e.target.checked) {
            setSelectedAddress(null)
            setIsBillingDetails(true)
            setStyle({ opacity: 1, display: 'block', transform: 'translateY(0)' })
        } else {
            setSelectedAddress(null)
            setIsBillingDetails(false)
            setStyle({ opacity: 0, display: 'none', transform: 'translateY(-100%)' })
        }
    }

    const initialValues = { firstName: '', lastName: '', email: '', phone: '', street: '', area: '', city: '', state: '0', zipCode: '' }
    const [ formValues, setFormValues ] = useState({...initialValues})
    const [ formErrors, setFormErrors ] = useState({})



  return (
    <>
        <Header />
        <div className="checkout">
            <h2 className="page-heading">Checkout</h2>
            <div className="row gap2">
                <div className='column gap2'>
                    {
                        token && 
                        <>
                            <AddressTable userAddresses={userAddresses} setSelectedAddress={setSelectedAddress} />
                            <div className="row gap1">
                                <input type='checkbox' name='new-address' onChange={differentAddressHandler} />     
                                <label htmlFor="new-address">Ship to a different address?</label>
                            </div>
                        </>
                    }
                    <div style={style}>
                        <Panel title="Billing Details" billing={{ formValues, setFormValues, formErrors }} />
                    </div>
                </div>
                <Panel title="Order Summary" billing={{ initialValues, formValues, setFormValues, isBillingDetails, formErrors, setFormErrors, isGuest, selectedAddress }} />
            </div>
        </div>
        <Footer />
    </>
  )
}

export default Checkout
