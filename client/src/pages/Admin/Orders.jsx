import React, { useEffect, useState } from 'react'
import styles from './Dash.module.css'
import Pagination from '../components/dashboard/Pagination'
const baseURL = import.meta.env.VITE_NODE_URL

const Orders = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const [ orders, setOrders ] = useState([])
    const [ idFromDb, setIdFromDb ] = useState()
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ itemsPerPage, setItemsPerPage ] = useState(9)

    const [ modelStyle, setModelStyle ] = useState({
        transform: "translateY(-100%)",
        opacity: 0
    })

    // Add or Edit Button Handling 
    const [ actionHandler, setActionHandler ] = useState({
        approvePanel: {
            display: "block",
        },
        declinePanel: {
            display: "none",
        },
        viewPanel: {
            display: "none",
        },
        deliverPanel: {
            display: "none",
        }
    })

    const showPanel = (e) => {
        e.preventDefault()

        setModelStyle({
            transform: "translateY(0)",
            opacity: 1
        })

        if (e.target.name == 'approveBtn') {
            setActionHandler({
                approvePanel: {
                    display: "block",
                },
                declinePanel: {
                    display: "none",
                },
                viewPanel: {
                    display: "none",
                },
                deliverPanel: {
                    display: "none",
                }
            })            
            setIdFromDb(e.target.id)
        } else if (e.target.name == 'declineBtn') {
            setActionHandler({
                approvePanel: {
                    display: "none",
                },
                declinePanel: {
                    display: "block",
                },
                viewPanel: {
                    display: "none",
                },
                deliverPanel: {
                    display: "none",
                }
            })
            setIdFromDb(e.target.id)
        } else if (e.target.name == 'viewBtn') {
            setActionHandler({
                approvePanel: {
                    display: "none",
                },
                declinePanel: {
                    display: "none",
                },
                viewPanel: {
                    display: "block",
                },
                deliverPanel: {
                    display: "none",
                }
            })
            setIdFromDb(e.target.id)
            getOrderItems(e.target.id)
        } else if (e.target.name == 'deliverBtn') {
            setActionHandler({
                approvePanel: {
                    display: "none",
                },
                declinePanel: {
                    display: "none",
                },
                viewPanel: {
                    display: "none",
                },
                deliverPanel: {
                    display: "block",
                }
            })
            setIdFromDb(e.target.id)
        } 

    }

    const [ orderItems, setOrderItems ] = useState([])

    const getOrderItems = async (id) => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/getorderitems/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setOrderItems(json.data.orderItems)
            } else {
                console.log(json)
            }
        }
    }

    useEffect(() => {
        document.title = "HH Power Tools | Orders"
        getOrders()
    }, [])


    const getOrders = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/getall`, {
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
                console.log(json)
            }
        }
    }

    setTimeout(()=> {
        setIsLoading(false)
    }, 50)

    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const currentOrders = orders.slice(firstIndex, lastIndex)


    const getFormat = (value) => {
        return (
            (value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )
    }

    const hidePanel = (e) => {
        if (e) {
            e.preventDefault()
        }
        setModelStyle({
            transform: "translateY(-100%)",
            opacity: 0
        })
    }
    
    const searchHandler = async (e) => {
        const { name, value } = e.target
        if (e.target.value == '') {
            getCustomers()
        } else {
            const token = localStorage.getItem("token")
            if (token) {
                const resp = await fetch(`${baseURL}/api/auth/searchcustomers/${value}`, {
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
                    console.log(json)
                }
            }
        }
    }

    const getDiscountedPrice = (cost, disc) => {
        let discVal = (cost * disc) / 100
        return (
            cost - discVal
        )
    }  
    

    const [ response, setResponse ] = useState({})
    
    const approveHandler = async (e) => {
        e.preventDefault()
        
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/approveOrder/${idFromDb}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getOrders()
                hidePanel()
            } else {
                if (!json.success) {
                    setResponse({
                        error: json.message
                    })
                } else {
                    setResponse({
                        error: json.error
                    })
                }
            }
    
            setTimeout(() => {
                setResponse({})
            }, 4000)
        }
    }

    const declineHandler = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")        
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/declineOrder/${idFromDb}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getOrders()
                hidePanel()
            } else {
                if (!json.success) {
                    setResponse({
                        error: json.message
                    })
                } else {
                    setResponse({
                        error: json.error
                    })
                }
            }
    
            setTimeout(() => {
                setResponse({})
            }, 4000)
        }
    }

    const deliverHandler = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")        
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/deliverOrder/${idFromDb}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getOrders()
                hidePanel()
            } else {
                if (!json.success) {
                    setResponse({
                        error: json.message
                    })
                } else {
                    setResponse({
                        error: json.error
                    })
                }
            }
    
            setTimeout(() => {
                setResponse({})
            }, 4000)
        }
    }

    const dateFormatter = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    }
    
  return (
    isLoading ? '' :
    <>
        { response.errors && <div className={styles.alertError}>{response.errors}</div> }
        { response.error && <div className={styles.alertError}>{response.error}</div> }
        { response.message && <div className={styles.alertSuccess}>{response.message}</div> }
        <div className={styles.overlay} style={modelStyle}>
            <div className={`${styles.model}`} >
                <form action="" style={actionHandler.declinePanel} className={`${styles.column} ${styles.gap2}`}>
                    <p>Are your sure to decline?</p>
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <a href="" className={`${styles.btn3}`} onClick={hidePanel}>Cancel</a>
                        <a href="" className={`${styles.btn2}`} onClick={declineHandler}>Yes, Decline</a>
                    </div>
                </form>
                <form action="" style={actionHandler.approvePanel} className={`${styles.column} ${styles.gap2}`}>
                    <p>Are your sure to approve?</p>
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <a href="" className={`${styles.btn3}`} onClick={hidePanel}>Cancel</a>
                        <a href="" className={`${styles.btn2}`} onClick={approveHandler}>Yes, Approve</a>
                    </div>
                </form>
                <form action="" style={actionHandler.deliverPanel} className={`${styles.column} ${styles.gap2}`}>
                    <p>Are your sure to mark it as delivered?</p>
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <a href="" className={`${styles.btn3}`} onClick={hidePanel}>Cancel</a>
                        <a href="" className={`${styles.btn2}`} onClick={deliverHandler}>Yes, Deliver</a>
                    </div>
                </form>
                <div style={actionHandler.viewPanel} >
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Product</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderItems && orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{ index + 1 }</td>
                                        <td>
                                            <div className={styles.tableImage}>
                                                <img src={ baseURL + item.product.images[0].imageUrl } alt={item.product.name} />
                                            </div>
                                        </td>
                                        <td>{ item.product.name }</td>
                                        <td>{ item.quantity }</td>
                                        <td>Rs. { getFormat( getDiscountedPrice(item.product.costPrice, item.product.discount)) }</td>
                                        <td>Rs. { getFormat( item.quantity * getDiscountedPrice(item.product.costPrice, item.product.discount)) }</td>
                                    </tr>
                                ))
                            }
                        </tbody>                    
                    </table>
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <a href="" className={`${styles.btn3}`} onClick={hidePanel}>Cancel</a>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.dPanel}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Orders</h2>
                <input type="text" placeholder='Search something here...' className={styles.searchField} onChange={searchHandler} />
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order No</th>
                                <th>Items</th>
                                <th>Total Bill</th>                                
                                <th>Shipping Cost</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentOrders && currentOrders.map((order, index) => (
                                    <tr key={index}>
                                        <td>{ order.orderNo }</td>
                                        <td className={`${styles.row} ${styles.gap}`}>
                                            <a href="" className={`${styles.btn} ${styles.successBtn}`} id={order._id} name='viewBtn' onClick={showPanel}>View Items</a>
                                        </td>
                                        <td>Rs { getFormat(order.totalBill) }</td>
                                        <td>Rs { getFormat(order.shippingFee) }</td>
                                        <td>{ order.customer && order.customer.firstName + ' ' + order.customer.lastName }</td>
                                        <td>{ order.customer && order.customer.phone }</td>
                                        <td>{ order.address && order.address.street + ' ' + order.address.area + ' ' + order.address.city }</td>
                                        <td>
                                            <span className={`${styles.badge} ${ order.status == 1 ? `${styles.warningBadge}` : order.status == 2 ? `${styles.successBadge}` : order.status == 3 ? `${styles.primaryBadge}` : '' }`}>
                                                { order.status == 1 ? 'Pending' : order.status == 2 ? 'Approved' : order.status == 3 ? 'Delivered' : order.status == 0 ? 'Declined' : '' }
                                            </span>
                                        </td>
                                        <td>{ dateFormatter(order.createdAt) }</td>
                                        <td className={`${styles.row} ${styles.gap0}`}>
                                            {
                                                order.status == 1 ? 
                                                <>
                                                    <a href="" className={`${styles.btn} ${styles.successBtn}`} id={order._id} name='approveBtn' onClick={showPanel}>Approve</a>
                                                    <a href="" className={`${styles.btn} ${styles.secondaryBtn}`} id={order._id} name='declineBtn'  onClick={showPanel}>Decline</a>
                                                </> : order.status == 2 ?
                                                <a href="" className={`${styles.btn} ${styles.primaryBtn}`} id={order._id} name='deliverBtn' onClick={showPanel}>Deliver</a> : ''
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    <Pagination totalItems={orders.length} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                </div>
            </div>
        </div>
    </>
  )
}

export default Orders
