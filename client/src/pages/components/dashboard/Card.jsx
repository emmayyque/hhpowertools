import React from 'react'
import styles from '../../Admin/Dash.module.css'
import * as Icons from 'react-icons/fa6'
import { useState } from 'react'
import { useEffect } from 'react'

const baseURL = import.meta.env.VITE_NODE_URL

const Counter = (maxCount) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < maxCount) {
          return prevCount + 1;
        } else {
          clearInterval(interval);
          return prevCount;
        }
      });
    }, 100); // Adjust speed by changing interval time

    return () => clearInterval(interval); // Cleanup on unmount
  }, [maxCount]);

  return count;
};

const Card = (props) => {
  const [ count, setCount ] = useState(0)

  let url = ""
  if (props.title == 'Orders') {
    url = `${baseURL}/api/order/getcount`
  } else if (props.title == 'Customers') {
    url = `${baseURL}/api/auth/getcustomerscount`
  } else if (props.title == 'Products') {
    url = `${baseURL}/api/product/getcount`
  } else if (props.title == 'Reviews') {
    url = `${baseURL}/api/review/getcount`
  }

  useEffect(() => {
    getStatData()
  }, [])  

  const getStatData = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      })
  
      const json = await resp.json()
  
      if (json.success) {
        setCount(json.data)
      } else {
        console.log(json.error)
      }
    }
  }

  const getFilteredCount = async (e) => {
    const { name, value } = e.target
    
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${url}?filter=${value}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })

      const json = await resp.json()
      if (json.success) {
        // console.log(json.data)
        setCount(json.data)
      } else {
        console.log(json.error)
      }
    }
  }

  return (
    // statData.length === 0 ? '' : 
    <div className={`${styles.dCard} ${styles.row}`}>
      <div className={`${styles.column} ${styles.gap2}`}>
        {
            props.title == 'Orders' ? 
            <Icons.FaBagShopping className={styles.icon4}/> : props.title == 'Customers' ? 
            <Icons.FaUsers className={styles.icon4}/> : props.title == 'Products' ? 
            <Icons.FaBoxOpen className={styles.icon4}/> : props.title == 'Reviews' ? 
            <Icons.FaCommentDots className={styles.icon4}/> : ''
        }
        <div className={`${styles.column} ${styles.gap0}`}>
            <h3>{ Number(count) }</h3>
            <h4>{props.title}</h4>
        </div>
      </div>
      <div>
        <select name="filter" id="filter" defaultValue={0} onChange={getFilteredCount} >
            <option value="0">Till Now</option>
            <option value="past7days">Past 7 Days</option>
            <option value="past30days">Past 30 Days</option>
            <option value="past6months">Past 6 Months</option>
        </select>
      </div>
    </div>
  )
}

export default Card
