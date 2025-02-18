import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import * as Icons from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import ProductContext from '../../context/products/ProductContext';
import CartContext from '../../context/cart/CartContext';

const SectionLabel = (props) => {
  const navigate = useNavigate();
  const prodData = useContext(ProductContext)
  const cartData = useContext(CartContext)
  const [ action, setAction ] = useState(null)

  const clickHandler = (e) => {
    if (e.target.innerHTML == 'Description') {
      props.setCurrentSection('Description')
    } else if (e.target.innerHTML == 'Specifications') {
      props.setCurrentSection('Specifications')
    } else if (e.target.innerHTML == 'Reviews') {
      props.setCurrentSection('Reviews')  
    } else if (e.target.innerHTML == 'Orders') {
      props.setCurrentSection('Orders')
    } else if (e.target.innerHTML == 'Addresses') {
      props.setCurrentSection('Addresses')  
    } else if (e.target.innerHTML == 'Profile') {
      props.setCurrentSection('Profile')  
    } else if (e.target.innerHTML == 'Logout') {
      props.setCurrentSection('Description')
      localStorage.clear()
      cartData.setCartItems([])
      navigate('/')
    }
  }

  
  const sortingHandler = (e) => {
    let sorting = e.target.value
    props.setSortingFilter(sorting)
  }

  // useEffect(() => {
  //   if (props.option.value == 1) {
  //     setAction("/Shop/1")
  //   } else if (props.option.value == 2) {
  //     setAction("/Shop/2")
  //   } else if (props.option.value == 3) {
  //     setAction("/Shop/3")
  //   } else if (props.option.value == 4) {
  //     setAction("/Shop/4")
  //   } else if (props.option.value == 5) {
  //     setAction("/Shop/5")
  //   }
  // })

  return (
    <div className="section-label row gap2">
        <h3>{ props.heading }</h3>
        {
            props.option && (
                <a href={props.option.ref} className='row gap0'>
                    {props.option.label}
                    <Icons.FaArrowRight className='icon'/>
                </a>
            )
        }
        {
          props.nav && (
            <ul className='navlist row'>
              {
                (props.nav).map((item, index) => (
                  <li key={index} onClick={clickHandler} className={props.currentSection == item.label ? 'active' : ''}>{item.label}</li>
                ))
              }              
            </ul>
          )
        }
        {/* {
          props.count && (
            <div className="result-count">
              {props.count} Products Found
            </div>
          )
        } */}
        {
          props.features && (
            <div className="filter row gap1">
              <select name="sorting" id="sorting" defaultValue={0} onChange={sortingHandler}>
                <option value="0">Default Sorting</option>
                <option value="1">Sort By Popularity</option>
                <option value="2">Sort By Average Rating</option>
                <option value="3">Sort By Latest</option>
                <option value="4">Sort By Price: High to Low</option>
                <option value="5">Sort By Price: Low to High</option>
              </select>
              <Icons.FaFilter className='icon' />
            </div>
          )
        }
    </div>
  )
}

export default SectionLabel
