import React, { useEffect, useState } from 'react'
import styles from '../../Admin/Dash.module.css'
import * as Icons from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import UserContext from '../../../context/user/UserContext'
const baseURL = import.meta.env.VITE_NODE_URL

const Header = () => {
  const data = useContext(UserContext)
  const [ user, setUser ] = useState(null)

  useEffect(() => {
    getPendingOrdersCount()
    getUser()
  }, [])

  const [ pendingOrdersCount, setPendingOrdersCount ] = useState(0)

  const getPendingOrdersCount = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${baseURL}/api/order/getpendingcount`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })

      const json = await resp.json()

      if (json.success) {
        setPendingOrdersCount(json.data)
      } else {
        console.log(json.error)
      }
    }
  }

  const getUser = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${baseURL}/api/auth/getuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })

      const json = await resp.json()

      if (json.success) {
        setUser(json.data)
      } else {
        console.log(json.error)
      }
    }
  }

  return (
    <div className={`${styles.dHeader} ${styles.row}`}>
      <div className={styles.column}>
        <h3>Dashboard</h3>
        <h4>Welcome, { user && user.username }</h4>
      </div>
      <div className={`${styles.row} ${styles.gap1}`}>
        <p>{ user && user.firstName + ' ' + user.lastName }</p>
        <Link to={"/Admin/Dashboard/Profile"}><Icons.FaUser className={styles.icon2} /></Link>
        <Link to={"/Admin/Dashboard/Orders"}>
          {
           pendingOrdersCount > 0 ?  <div className={`${styles.orderCount} ${styles.row}`}>{ pendingOrdersCount }</div> : ''
          }
          <Icons.FaBell className={styles.icon3} />
        </Link>
      </div>
    </div>
  )
}

export default Header
