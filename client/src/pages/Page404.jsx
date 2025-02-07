import React, { useEffect } from 'react'
import CartContext from '../context/cart/CartContext'
import { useState } from 'react'
import { useContext } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import * as Icons from 'react-icons/fa6'

const baseURL = import.meta.env.VITE_NODE_URL

const Page404 = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const data = useContext(CartContext)
    
    const initialValues = {
        orderNo: ''
    }

    const [ formValues, setFormValues ] = useState({...initialValues})
    const [ formErrors, setFormErrors ] = useState({})
    const [ isSubmit, setIsSubmit ] = useState(false)
    const [ trackingResult, setTrackingResult ] = useState(null)

    useEffect(() => {
        document.title = "HH Power Tools | Tracking"
        setTimeout(() => {
            setIsLoading(false)
        }, 50);
    }, [])


    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            orderTrackingHandler()
        }
    }, [formErrors])

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormValues({...formValues, [name]: value})
    }

    const handleSubmission = (e) => {
        e.preventDefault()
        setFormErrors(validate(formValues))
        setIsSubmit(true)
    }

    const validate = (values) => {
        const errors = {}

        if (!values.orderNo) {
            errors.orderNo = 'Tracking no is required'
        }

        console.log(values.orderNo.length)

        if (values.orderNo.length != 14) {
            errors.orderNo = 'Tracking no must be of 14 characters'
        }

        return errors
    }

    const orderTrackingHandler = async (e) => {
        const resp = await fetch(`${baseURL}/api/order/trackOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                orderNo: formValues.orderNo
            })
        })

        const json = await resp.json()

        if (json.success) {
            console.log(json)
            setTrackingResult(json.data)
        } else {
            console.log(json.error)
        }
    }   


    const dateFormatAhead = (createdDate, days) => {
        const date = new Date(createdDate);
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }


    return (
        isLoading ? '' :
        <>
            <Header />
            <div className="page-404">
                <h2 className='page-heading'>404! Page not found !!</h2>
            </div>
            <Footer />
        </>
    )
}

export default Page404
