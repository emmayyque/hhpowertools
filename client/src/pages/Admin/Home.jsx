import React from 'react'
import styles from '../Admin/Dash.module.css'
import Statistics from '../components/dashboard/Statistics'
import ReviewAnalysis from '../components/dashboard/ReviewAnalysis'
import Panel from '../components/dashboard/Panel'

const Home = () => {
  return (
    <>
        <div className={`${styles.row} ${styles.gap2}`}>
            <Statistics />
            <ReviewAnalysis />
        </div>
        <div className={`${styles.row} ${styles.gap2}`}>
            <Panel title="Orders" description="done this month" redirect="/Admin/Dashboard/Orders" btnText="View All Orders"/>
            <Panel title="Sales Overview" description="Analytics of Past 1 Year"/>
        </div>
    </>
  )
}

export default Home
