import React, { useContext, useEffect, useState } from 'react'
import styles from './Dash.module.css'
import Pagination from '../components/dashboard/Pagination'
const baseURL = import.meta.env.VITE_NODE_URL

const Customers = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const [ customers, setCustomers ] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ itemsPerPage, setItemsPerPage ] = useState(9)

    
    useEffect(() => {
        getCustomers()
    }, [])

    const getCustomers = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/auth/getcustomers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setCustomers(json.data)
            } else {
                console.log(json)
            }
        }
    }
    
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    let currentCustomers = customers.slice(firstIndex, lastIndex)

    setTimeout(()=> {
        setIsLoading(false)
    }, 50)


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
                    setCustomers(json.data)
                } else {
                    console.log(json)
                }
            }
        }
    }

    const deleteHandler = async () => {
        const token = localStorage.getItem("token")
        const id = ""
        if (token) {
            const resp = await fetch(`${baseURL}/api/auth/deletecustomer/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })

            const json = await resp.json()
            if (json.success) {
                setCustomers(json.data)
            } else {
                console.log(json)
            }
        }
    }

  return (
    isLoading ? '' :
    <div className={styles.dPanel}>
        <div className={`${styles.row} ${styles.dActions}`}>
            <h2 className={styles.dPanelHeading}>Customers</h2>
            <input type="text" placeholder='Search something here...' className={styles.searchField} onChange={searchHandler} />
        </div>
        <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sr.</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentCustomers && currentCustomers.map((customer, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{customer.firstName}</td>
                                    <td>{customer.lastName}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.username}</td>
                                    <td>{customer.phone}</td>
                                    <td>{customer.createdAt}</td>
                                    <td>{customer.updatedAt}</td>
                                    <td className={`${styles.row} ${styles.gap0}`}>
                                        <a href="" className={`${styles.btn} ${styles.dangerBtn}`} id={customer._id} onClick={deleteHandler} name='deleteBtn'>Delete</a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div>
                <Pagination totalItems={customers.length} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
            </div>
        </div>
    </div>
  )
}

export default Customers
