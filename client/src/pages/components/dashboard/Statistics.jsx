import React from 'react'
import styles from '../../Admin/Dash.module.css'
import Card from './Card'

const Statistics = () => {

  return (
    <div className={`${styles.statistics} ${styles.column} ${styles.gap2}`}>
        <div className={`${styles.row} ${styles.gap2}`}>
            <Card title="Orders" count="200"/>
            <Card title="Customers" count="200"/>
        </div>
        <div className={`${styles.row} ${styles.gap2}`}>
            <Card title="Products" count="200"/>
            <Card title="Reviews" count="200"/>
        </div>
    </div>
  )
}

export default Statistics
