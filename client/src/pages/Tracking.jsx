import React, { useEffect } from 'react'
import CartContext from '../context/cart/CartContext'
import { useState } from 'react'
import { useContext } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import * as Icons from 'react-icons/fa6'

const baseURL = import.meta.env.VITE_NODE_URL

const Tracking = () => {
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
            setTrackingResult(json.data)
        } else {
            setFormErrors({ orderNo: "Order No not found" })
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


    const enableReviewForm = (e) => {
        e.preventDefault()
        const { name, id } = e.target

        setFormStyle({
            display: 'flex'
        })

        const product = {
            id: id,
            name: name
        }

        setReviewFormValues({...reviewFormValues, product: product})
    }

    const [ formStyle, setFormStyle ] = useState({
        display: 'none',
    })

    const revInitialValues = {
        product: { id: '', name: '' },
        rating: 0,
        review: '',
        name: '',
        email: ''
    }

    const [ response, setResponse ] = useState({})
    const [ reviewFormValues, setReviewFormValues ] = useState({...revInitialValues})
    const [ reviewFormErrors, setReviewFormErrors ] = useState({})
    const [ reviewFormIsSubmit, setReviewFormIsSubmit ] = useState(false)

    const inputHandler = (e) => {
        const { name, value } = e.target
        setReviewFormValues({...reviewFormValues, [name]: value})
    }
    
    const ratingInputHandler = (e) => {
        const { id } = e.target.closest('label')
        const rating = id
        setReviewFormValues({...reviewFormValues, rating: rating}) 
    }

    const addReview = async () => {
        const resp = await fetch(`${baseURL}/api/review/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                review: reviewFormValues.review,
                rating: Number(reviewFormValues.rating),
                product: reviewFormValues.product.id,
                name: reviewFormValues.name,
                email: reviewFormValues.email,
            })
        })

        const json = await resp.json()
        if (json.success) {
            setResponse({
                message: json.message
            })
            setFormStyle({
                display: 'none',
            })
            setReviewFormValues({...revInitialValues})
        } else {
            setResponse({
                errors: json.error
            })
        }

        setTimeout(() => {
            setResponse({})
        }, 4000);
    }

    useEffect(() => {
        if (Object.keys(reviewFormErrors).length === 0 && reviewFormIsSubmit) {
            addReview()
        }
    }, [reviewFormErrors])

    const reviewSubmissionHandler = (e) => {
        e.preventDefault()
        setReviewFormErrors(reviewValidate(reviewFormValues))
        setReviewFormIsSubmit(true)
    }

    const reviewValidate = (values) => {
        const errors = {}
        
        if (!values.product.id) {
            errors.product = 'Product is required'
        }

        if (!values.review) {
            errors.review = 'Review is required'
        }

        if (!values.name) {
            errors.name = 'Name is required'
        } else if (values.name.length < 3) {
            errors.name = 'Name cannot be shorter than 3 characters'
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!values.email) {
            errors.email = 'Email is required'
        } else if (!emailRegex.test(values.email)) {
            errors.email = 'Enter a valid email address'
        } 

        return errors
    }

    return (
        isLoading ? '' :
        <>
            <Header />
            <div className="tracking">
                { response.errors && <div className='alertError'>{response.errors}</div> }
                { response.error && <div className='alertError'>{response.error}</div> }
                { response.message && <div className='alertSuccess'>{response.message}</div> }
                <h2 className='page-heading'>Track your Order</h2>
                <div className="tracking-input row gap1">
                    <div className="form-field">
                        <label htmlFor="orderNo">Tracking No</label>
                        <input type="text" name='orderNo' id='orderNo' value={formValues.orderNo} onChange={handleInput}/>
                        { formErrors.orderNo && <span className="form-field-error">{ formErrors.orderNo }</span> }
                    </div>
                    <div>
                        <button className='btn2' onClick={handleSubmission}>Track Now</button>
                    </div>
                </div>
                {
                    trackingResult && 
                    <>
                        <p>Order ID: {trackingResult.orderNo}</p>
                        <div className="tracking-header row gap2">
                            <div className='column'>
                                <h4>Estimated Delivery Time</h4>
                                <p>{ dateFormatAhead(trackingResult.createdAt, 5) }</p>
                            </div>
                            <div className="divider"></div>
                            <div className='column'>
                                <h4>Status</h4>
                                <p> 
                                    {
                                        trackingResult.status == 0 ? 'Declined' :
                                        trackingResult.status == 1 ? 'Booked' :
                                        trackingResult.status == 2 ? 'Approved' :
                                        trackingResult.status == 3 ? 'Delivered' : ''
                                    }
                                </p>
                            </div>
                            <div className="divider"></div>
                            <div className='column'>
                                <h4>Tracking #</h4>
                                <p>{ trackingResult.orderNo }</p>
                            </div>
                        </div>
                        <div className="tracking-body row">
                            <div className="track-status row">
                                <div className={`bar ${ trackingResult.status > 0 ? 'active' : ''}`}></div>
                                <div className="info column">
                                    <div className="circle">
                                        {
                                            trackingResult.status > 0 ? <Icons.FaCircleCheck className='icon-1 active-icon-1'/> : 
                                            <Icons.FaCircle className='icon-1'/>
                                        }
                                    </div>
                                    <p>Order Booked</p>
                                </div>
                            </div>
                            <div className="track-status row">
                                <div className={`bar ${ trackingResult.status > 1 ? 'active' : ''}`}></div>
                                <div className="info column">
                                    <div className="circle">
                                        {
                                            trackingResult.status > 1 ? <Icons.FaCircleCheck className='icon-1 active-icon-1'/> : 
                                            <Icons.FaCircle className='icon-1'/>
                                        }
                                    </div>
                                    <p>Order Approved</p>
                                </div>
                            </div>
                            <div className="track-status row">
                                <div className={`bar ${ trackingResult.status > 2 ? 'active' : ''}`}></div>
                                <div className="info column">
                                    <div className="circle">
                                        {
                                            trackingResult.status > 2 ? <Icons.FaCircleCheck className='icon-1 active-icon-1'/> : 
                                            <Icons.FaCircle className='icon-1'/>
                                        }
                                    </div>
                                    <p>Order Delivered</p>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {
                    trackingResult &&                     
                        <div className='tritems column'>
                            {
                                trackingResult.status === 3 ? 
                                trackingResult.orderItems.map((item, index) => (
                                    <div className='tritem row' key={index}>
                                        <div className="row">
                                            <div className="trimg">
                                                <img src={baseURL+item.product.images[0].imageUrl} alt="" />
                                            </div> 
                                            <h2>{ item.product.name }</h2>
                                        </div>
                                        <button className='btn2 row' onClick={enableReviewForm} name={item.product.name} id={item.product._id}>Give Review</button>
                                    </div>
                                )) : ''
                            }
                        </div>
                }

                <form action="" className='column gap1' style={formStyle}>
                    <div className="form-field column">
                        <label htmlFor="">Product</label>
                        <select name="product" id="" disabled >
                            <option value={reviewFormValues.product.id}>{reviewFormValues.product.name}</option>
                        </select>
                        { reviewFormErrors.product && <span className='form-field-error'>{ reviewFormErrors.product }</span> }
                    </div>
                    <div className="form-field column">
                        <label htmlFor="">Your Rating</label>            
                        <div className="row">
                            <input type="radio" name='rating' id='rating1'/>
                            <label htmlFor="rating" className='stars' id={1} onClick={ratingInputHandler} >{ reviewFormValues.rating >= 1 ? <Icons.FaStar /> : <Icons.FaRegStar /> }</label>

                            <input type="radio" name='rating' id='rating2' />
                            <label htmlFor="rating" className='stars' id={2} onClick={ratingInputHandler} >{ reviewFormValues.rating >= 2 ? <Icons.FaStar /> : <Icons.FaRegStar /> }</label>

                            <input type="radio" name='rating' id='rating3' />
                            <label htmlFor="rating" className='stars' id={3} onClick={ratingInputHandler} >{ reviewFormValues.rating >= 3 ? <Icons.FaStar /> : <Icons.FaRegStar /> }</label>
                            
                            <input type="radio" name='rating' id='rating4' />
                            <label htmlFor="rating" className='stars' id={4} onClick={ratingInputHandler} >{ reviewFormValues.rating >= 4 ? <Icons.FaStar /> : <Icons.FaRegStar /> }</label>
                            
                            <input type="radio" name='rating' id='rating5' />
                            <label htmlFor="rating" className='stars' id={5} onClick={ratingInputHandler} >{ reviewFormValues.rating == 5 ? <Icons.FaStar /> : <Icons.FaRegStar /> }</label>
                        </div>
                    </div>
                    <div className="form-field column">
                        <label htmlFor="">Your Review About The Product</label>
                        <textarea  name='review' rows={'10'} onChange={inputHandler} value={ reviewFormValues.review }></textarea>
                        { reviewFormErrors.review && <span className='form-field-error'>{ reviewFormErrors.review }</span> }
                    </div>
                    <div className="form-field column">
                        <label htmlFor="">Name</label>
                        <input type="text" name='name' id='name' value={reviewFormValues.name} onChange={inputHandler} />
                        { reviewFormErrors.name && <span className='form-field-error'>{ reviewFormErrors.name }</span> }
                    </div>
                    <div className="form-field column">
                        <label htmlFor="">Email</label>
                        <input type="email" name='email' id='email' value={reviewFormValues.email} onChange={inputHandler} />
                        { reviewFormErrors.email && <span className='form-field-error'>{ reviewFormErrors.email }</span> }
                    </div>
                    <a href="" className='btn2 row' onClick={reviewSubmissionHandler}>
                        <Icons.FaPenToSquare className='icon' />
                        Add Review
                    </a>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default Tracking
