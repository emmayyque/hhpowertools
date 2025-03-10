import React, { PureComponent } from 'react';
import styles from '../../Admin/Dash.module.css'
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { useEffect } from 'react';
const baseURL = import.meta.env.VITE_NODE_URL

const Panel = (props) => {

    const [ orders, setOrders ] = useState([])
    const [ sales, setSales ] = useState([])

    const getDeliveredOrdersInPastMonth = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/getDeliveredOrdersInPastMonth`, {
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

    const getSalesOverviewInPastYear = async () => {        
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/order/getSalesOverviewInPastYear`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })

            const json = await resp.json()

            if (json.success) {
                processSalesData(json.data)
            } else {
                console.log(json)
            }
        }
    }

    // useEffect(() => {        
    //     processSalesData(sales)
    // }, [sales])

    const processSalesData = (salesData) => {
        salesData.forEach(element => {
            if (element._id.month == 1) {
                element._id.month = 'January'
            } else if (element._id.month == 2) {
                element._id.month = 'February'
            } else if (element._id.month == 3) {
                element._id.month = 'March'
            } else if (element._id.month == 4) {
                element._id.month = 'April'
            } else if (element._id.month == 5) {
                element._id.month = 'May'
            } else if (element._id.month == 6) {
                element._id.month = 'June'
            } else if (element._id.month == 7) {
                element._id.month = 'July'
            } else if (element._id.month == 8) {
                element._id.month = 'August'
            } else if (element._id.month == 9) {
                element._id.month = 'September'
            } else if (element._id.month == 10) {
                element._id.month = 'October'
            } else if (element._id.month == 11) {
                element._id.month = 'November'
            } else if (element._id.month == 12) {
                element._id.month = 'December'
            } 
        });

        setSales(salesData)
    }

    useEffect(() => {
        if (props.title == 'Orders') {
            getDeliveredOrdersInPastMonth()
        }

        if (props.title == 'Sales Overview') {
            getSalesOverviewInPastYear()
        }
    }, [])


    const getFormat = (value) => {
        return (
            (value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )
    }


  return (
    <div className={`${styles.reviewAnalysis} ${styles.dPanel}`}>
        <h2 className={styles.dPanelHeading}>{props.title}</h2>
        {
            props.title == 'Orders' ?  <p>{ orders.length + " " + props.description }</p> : props.title == 'Sales Overview' ? <p>{ props.description }</p> : '0'
        }
        <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
            {
                props.title == 'Orders' ? 
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order No</th>
                                <th>Total Bill</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders && orders.map((order, index) => (
                                    <tr key={index} >
                                        <td>{order.orderNo}</td>
                                        <td>Rs {getFormat(order.totalBill)}</td>
                                        <td>{ order.customer && order.customer.firstName + " " + order.customer.lastName}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles.primaryBadge}`}>Delivered</span>
                                        </td>   
                                        <td>{order.createdAt}</td>
                                    </tr>
                                ))
                            }   
                        </tbody>
                    </table>
                </div> : props.title == 'Sales Overview' ? 
                <ResponsiveContainer width='100%' height={300}>
                    <LineChart
                        width={500}
                        height={300}
                        data={sales}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id.month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total_sales" stroke="#26ad20" activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="total_orders" stroke="#ffc107" activeDot={{ r: 7 }} />
                    </LineChart>
                </ResponsiveContainer> : ''
            }
            {
                props.redirect && (
                    <div className={`${styles.column} ${styles.actions}`}>
                        <Link to={`${props.redirect}`} className={styles.btn2}>{props.btnText}</Link>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default Panel
