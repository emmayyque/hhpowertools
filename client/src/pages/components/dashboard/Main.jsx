import React from 'react'
import styles from '../../Admin/Dash.module.css'
import Header from './Header'
import { Route, Routes } from 'react-router-dom'
import Home from '../../Admin/Home'
import Categories from '../../Admin/Categories'
import Customers from '../../Admin/Customers'
import Products from '../../Admin/Products'
import Orders from '../../Admin/Orders'
import Reviews from '../../Admin/Reviews'
import Profile from '../../Admin/Profile'
import Miscellaneous from '../../Admin/Miscellaneous'

const Main = () => {
  return (
    <div className={styles.main}>
      <Header />
      <div className={`${styles.mainBody} ${styles.column} ${styles.gap2}`}>
        <Routes>
            <Route index element={ <Home  /> }/>
            <Route exact path='/Categories' element={ <Categories /> } />
            <Route exact path='/Customers' element={ <Customers /> } />
            <Route exact path='/Products' element={ <Products /> } />
            <Route exact path='/Orders' element={ <Orders /> } />
            <Route exact path='/Reviews' element={ <Reviews /> } />
            <Route exact path='/Profile' element={ <Profile /> } />
            <Route exact path='/Miscellaneous' element={ <Miscellaneous /> } />
        </Routes>
      </div>
    </div>
  )
}

export default Main
