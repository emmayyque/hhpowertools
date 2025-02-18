import React, { useEffect } from 'react'
import styles from './Dash.module.css'
import Sidebar from '../components/dashboard/Sidebar'
import Main from '../components/dashboard/Main'
import Loader from '../components/Loader'
import { useState } from 'react'

const Dashboard = () => {

  const [ isLoading, setIsLoading ] = useState(true)
  
  useEffect(() => {
    document.title = "HH Power Tools | Dashboard"
  }, [])

  setTimeout(() => {
    setIsLoading(false)
  }, 1500);

  return (
    isLoading ? <Loader /> :
    <div className={`${styles.dashboard} ${styles.row}`}>
        <Sidebar />
        <Main />
    </div>
  )
}

export default Dashboard
