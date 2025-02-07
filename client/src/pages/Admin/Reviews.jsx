import React, { useEffect } from 'react'
import styles from './Dash.module.css'
import { useState } from 'react'
import Pagination from '../components/dashboard/Pagination'
const baseURL = import.meta.env.VITE_NODE_URL

const Reviews = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const [ reviews, setReviews ] = useState([])
    const [ idFromDb, setIdFromDb ] = useState()
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ itemsPerPage, setItemsPerPage ] = useState(9)

    const [ modelStyle, setModelStyle ] = useState({
        transform: "translateY(-100%)",
        opacity: 0
    })

    const getReviews = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/review/getall`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setReviews(json.data)
            } else {
                console.log(json)
            }            
        }
    }
    
    // Add or Edit Button Handling 
    // const [ actionHandler, setActionHandler ] = useState({
    //     approvePanel: {
    //         display: "block",
    //     },
    //     declinePanel: {
    //         display: "none",
    //     },
    //     viewPanel: {
    //         display: "none",
    //     }
    // })

    const showPanel = (e) => {
        e.preventDefault()

        setModelStyle({
            transform: "translateY(0)",
            opacity: 1
        })

        setIdFromDb(e.target.id)
    }

    const hidePanel = (e) => {
        e.preventDefault()
        setModelStyle({
            transform: "translateY(-100%)",
            opacity: 0
        })
    }

    const deleteHandler = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch (`${baseURL}/api/review/delete/${idFromDb}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })

            const json = await resp.json()
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getReviews()
            } else {
                setResponse({
                    message: json.error
                })
            }
        }
    }

    useEffect(() => {
        document.title = "HH Power Tools | Dashboard"
        getReviews()
    }, [])

    setTimeout(()=> {
        setIsLoading(false)
    }, 50)
    
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const currentReviews = reviews.slice(firstIndex, lastIndex)

    const [response, setResponse] = useState({})

  return ( 
    isLoading ? '' :
    <>
        { response.errors && <div className={styles.alertError}>{response.errors}</div> }
        { response.error && <div className={styles.alertError}>{response.error}</div> }
        { response.message && <div className={styles.alertSuccess}>{response.message}</div> }
        <div className={styles.overlay} style={modelStyle}>
            <div className={`${styles.model}`} >
                <form action=""  className={`${styles.column} ${styles.gap2}`}>
                    <p>Are your sure to delete?</p>
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <a href="" className={`${styles.btn3}`} onClick={hidePanel}>Cancel</a>
                        <a href="" className={`${styles.btn2}`} onClick={deleteHandler} >Yes, Delete</a>
                    </div>
                </form>
            </div>
        </div>
        <div className={styles.dPanel}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Reviews</h2>
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Review</th>
                                <th>Rating</th>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentReviews && currentReviews.map((review, index) => (
                                    <tr key={index}>
                                        <td>{ index + 1 }</td>
                                        <td>{ review.review }</td>
                                        <td>{ review.rating }</td>
                                        <td>{ review.product && review.product.name }</td>
                                        <td>{ review.name }</td>
                                        <td>{ review.email }</td>
                                        <td>{ review.createdAt }</td>
                                        <td className={`${styles.row} ${styles.gap0}`}>
                                            <a href="" className={`${styles.btn} ${styles.dangerBtn}`} id={ review._id } onClick={showPanel}>Delete</a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    <Pagination totalItems={reviews.length} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                </div>
            </div>
        </div>
    </>
  )
}

export default Reviews
