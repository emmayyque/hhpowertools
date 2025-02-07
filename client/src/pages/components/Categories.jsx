import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { data, Link } from 'react-router-dom'
import CategoryContext from '../../context/categories/CategoryContext'
import ProductContext from '../../context/products/ProductContext'
const baseURL = import.meta.env.VITE_JSON_SERVER_URL

const Categories = (props) => {
  const catData = useContext(CategoryContext)

  return (
    <div className='card column gap1'>
      <h2>Browse Categories</h2>
      <ul>
        {
          catData.categories && (catData.categories).map((item, index) => (
            <li key={index}>
              {/* <Link to={`/Shop/${item.name.split(" ").join("-")}`} onClick={specificCategoryHandler} id={`${item.id}`}>{item.name}</Link> */}
              <Link to={`/shop/${item.name.split(' ').join('-').toLowerCase()}`} id={`${item.id}`}>{item.name}</Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Categories
