import React, { useEffect } from 'react'
import styles from './Dash.module.css'
import Sidebar from '../components/dashboard/Sidebar'
import Main from '../components/dashboard/Main'

const Dashboard = () => {

  useEffect(() => {
    document.title = "HH Power Tools | Dashboard"
  }, [])

  return (
    <div className={`${styles.dashboard} ${styles.row}`}>
        <Sidebar />
        <Main />
    </div>
  )
}

export default Dashboard
