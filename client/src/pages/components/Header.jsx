import React, { useContext, useEffect, useState } from 'react'
import * as Icons from "react-icons/fa6";
import Logo from '../../assets/images/logo3-white.png'
import MobLogo from '../../assets/images/logo3-white-mob.png'
import { Link } from 'react-router-dom';
import CartContext from '../../context/cart/CartContext';
import CategoryContext from '../../context/categories/CategoryContext';
import ProductContext from '../../context/products/ProductContext';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const baseURL = import.meta.env.VITE_NODE_URL

const Header = (props) => {
    const cartData = useContext(CartContext)
    const catData = useContext(CategoryContext)
    const prodData = useContext(ProductContext)
    
    const [ isLoading, setIsLoading ] = useState(true)

    setTimeout(() => {
        setIsLoading(false)
    }, 50);
    
    const getFormat = (value) => {
        return (
            (value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )
    }

    const getDiscountedPrice = (costPrice, discount) => {
        let discVal = (costPrice * discount) / 100
        return (
            costPrice - discVal
        )
    }  


    const getCartTotal = () => {
        let total = 0
        for (let i = 0; i < cartData.cartItems.length; i++) {
            total += cartData.cartItems[i].price * cartData.cartItems[i].quantity;
        }
        return total
    }

    const [ quickCartStyle, setQuickCartStyle ] = useState(
        {
            transform: 'translateX(100%)',
            opacity: 0
        }
    )

    const triggerQuickCart = (e) => {
        e.preventDefault()
        if (quickCartStyle.transform == 'translateX(100%)') {
            setQuickCartStyle({
                transform: 'translateX(0)',
                opacity: 1
            })
        } else if (quickCartStyle.transform == 'translateX(0)') {
            setQuickCartStyle({
                transform: 'translateX(100%)',
                opacity: 0
            })
        }
    }


    const initialValues = {
        category: 0,
        searchTerm: ''
    }

    const [ searchValues, setSearchValues ] = useState({ ...initialValues })
    
    const categorySelectionHandler = (e) => {
        const { name, value } = e.target
        setSearchValues({ ...searchValues, [name]: value })
    }

    const searchHandler = (e) => {
        const { name, value } = e.target
        
        if ( searchValues.category == 0) {
            searchProduct(value)
        } else {
            searchProductByCategory(value, searchValues.category)
        }

        if ( value == '' ) {
            setFilteredProducts(null)
        }
    }

    const searchProduct = async (searchTerm) => {
        const resp = await fetch(`${baseURL}/api/product/searchproduct/${searchTerm}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await resp.json()

        if (json.success) {
            setFilteredProducts(json.data)
        } else {
            console.log(json.error)
        }
    }

    const searchProductByCategory = async (searchTerm, category) => {
        const resp = await fetch(`${baseURL}/api/product/searchproductbycategory/${searchTerm}/category/${category}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await resp.json()
        console.log(json)
        console.log(searchTerm)
        console.log(category)

        if (json.success) {
            setFilteredProducts(json.data)
        } else {
            console.log(json.error)
        }
    }

    const removeFromCartHandler = (e) => {
        let itemId = e.target.closest(".citem").id
        cartData.removeFromCart(itemId)
    }

    const [ mobNavBarStyle, setMobNavbarStyle ] = useState(
        {
            opacity: 0,
            transform: "translateX(-100%)"
        }
    )

    const mobNavbarHandlder = () => {
        if (mobNavBarStyle.opacity == 0) {
            setMobNavbarStyle(
                {
                    opacity: 1,
                    transform: "translateX(0)"
                }
            )
        } else if (mobNavBarStyle.opacity == 1) {
            setMobNavbarStyle(
                {
                    opacity: 0,
                    transform: "translateX(-100%)"
                }
            )
        }
        
    }

    const [ mobSearchBarStyle, setMobSearchBarStyle ] = useState(
        {
            opacity: 0,
            transform: "translateY(-100%)"
        }
    )

    const mobSearchBarHandler = () => {
        if (mobSearchBarStyle.opacity == 0) {
            setMobSearchBarStyle(
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            )
        } else if (mobSearchBarStyle.opacity == 1) {
            setMobSearchBarStyle(
                {
                    opacity: 0,
                    transform: "translateY(-100%)"
                }
            )
        }
    }

    const [ isSticky, setIsSticky ] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsSticky(true)
            } else {
                setIsSticky(false)
            }
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }

    }, [])

    
    const [ filteredProducts, setFilteredProducts ] = useState(null)

    
  return (
    <>
        <div className="cart-popup" style={quickCartStyle}>
            <div className="clabel row gap1">
                <h3>Quick Cart</h3>
            </div>
            <div className="cbody">
                {
                    cartData.cartItems && cartData.cartItems.length > 0 ? (
                        (cartData.cartItems).map((item, index) => (
                            <div className="citem row gap1" key={index} id={`${item.id}`}>
                                <div className="cimg">
                                    <img src={item.imageUrl} alt="Logo" />
                                </div>
                                <div className="cdet">
                                    <h2>{ item.name }</h2>
                                    <p>{ item.quantity } x { getFormat(item.price) }Rs</p>
                                </div>
                                <Icons.FaXmark className="icon" id={`${item.id}`} onClick={removeFromCartHandler}/>
                            </div>
                        ))
                        
                    ) : 
                    <p>There is no items in the cart !!</p>
                }
            </div>
            <div className="cactions row gap1">
                <h3>Total: Rs.{ getFormat(getCartTotal()) }</h3>
                <div className='row gap1'>
                    <button className='btn3' onClick={triggerQuickCart}>Close</button>
                    {/* <a href="" className='btn3' onClick={hideQuickCart}>Close</a> */}
                    <Link to="/shop/cart" className='btn2'>View Cart</Link>
                </div>
            </div>
        </div>
        <div className={`header row`}>
            <div className="logo">
                <Link to="/">
                    <img src={Logo} alt="HH-PowerTools-Logo" />
                </Link>
            </div>
            <div className="mob-logo">
                <Link to="/">
                    <img src={MobLogo} alt="HH-PowerTools-Logo" />
                </Link>
            </div>
            <div className="searchbar row">
                <form action="" className='row'>
                    <select name="category" id="category" value={searchValues.category} onChange={categorySelectionHandler}>
                        <option value="0">Select Category</option>
                        {
                            catData.categories && (
                                (catData.categories).map((category, index) => (
                                    <option value={category._id} key={index}>{category.name}</option>
                                ))
                            )
                        }
                    </select>
                    <div className="divider"></div>
                    <input type="text" name="searchTerm" id="searchTerm" placeholder='Search something here' onChange={searchHandler}/>
                </form>
                <Icons.FaMagnifyingGlass className='icon'/>
                {
                    filteredProducts && 
                    <div className="search-results">
                        {
                            filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
                                <div className="sritem row gap2" key={index}>
                                    <div className="srimg">
                                        <img src={`${product.imageUrl}`} alt="" />
                                    </div>
                                    <div className="srdet column">
                                        <h2>{ product.name }</h2>
                                        <span className="actual-price">Rs. { getFormat(getDiscountedPrice(product.costPrice, product.discount)) }</span>
                                    </div>
                                </div>
                            )) :
                            <p>No results found with the given term</p>
                        }
                    </div>
                }
            </div>
            <div className="mob-searchbar row" style={mobSearchBarStyle}>
                <form action="" className='row'>
                    <select name="category" id="category" value={searchValues.category} onChange={categorySelectionHandler}>
                        <option value="0" >Select Category</option>
                        {
                            catData.categories && (
                                (catData.categories).map((category, index) => (
                                    <option value={category.id} key={index}>{category.name}</option>
                                ))
                            )
                        }
                    </select>
                    <div className="divider"></div>
                    <input type="text" name="searchTerm" id="searchTerm" placeholder='Search something here' onChange={searchHandler}/>
                </form>
                <Icons.FaXmark className='icon' onClick={mobSearchBarHandler}/>
                {
                    // prodData.filteredProducts && 
                    // <div className="search-results">
                    //     {
                    //         prodData.filteredProducts.length > 0 ? (prodData.filteredProducts).map((product, index) => (
                    //             <div className="sritem row gap2" key={index}>
                    //                 <div className="srimg">
                    //                     <img src={`${product.image_url}`} alt="" />
                    //                 </div>
                    //                 <div className="srdet column">
                    //                     <h2>{ product.name }</h2>
                    //                     <span className="actual-price">Rs. { getFormat(getDiscountedPrice(product.costPrice, product.discount)) }</span>
                    //                 </div>
                    //             </div>
                    //         )) :
                    //         <p>No results found with the given term</p>
                    //     }
                    // </div>
                }
            </div>
            <div className="actions row gap2">
                <div className="row gap1 align-start">
                    <Icons.FaBars className='icon mob-icon' onClick={mobNavbarHandlder}/>
                    <Icons.FaMagnifyingGlass className='icon mob-icon' onClick={mobSearchBarHandler}/>
                    <Link to={"/account"}><Icons.FaUser className='icon'/></Link>
                    <div className="cartIco row gap0" onClick={triggerQuickCart}>
                        <div>
                            <Icons.FaBagShopping className='icon'/>
                            <span className='row'>{ cartData.cartItems.length }</span>
                        </div>
                        <span>Rs.{ getFormat(getCartTotal()) }</span>
                    </div>
                    
                    <Link to={"/shop"}><Icons.FaShop className='icon mob-icon'/></Link>
                </div>
                <Link to="/shop"  className='btn1 row gap1'>
                    <Icons.FaBagShopping className='icon'/>
                    <span>Go To Shop</span>
                </Link>
            </div>
        </div>
        <div className="navbar">
            <ul className='row'>
                <li>
                    <Link to={'/'}>Home</Link>
                </li>
                {
                    catData.categories && (catData.categories).map((category, index) => (
                        <li key={index}>
                            <Link to={`/shop/${category.name.split(" ").join("-").toLowerCase()}`}>{category.name}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
        <div className="mob-navbar" style={mobNavBarStyle} onClick={mobNavbarHandlder}>
            <ul className='column align-start'>
                <li>
                    <Link to={'/'}>Home</Link>
                </li>
                {
                    catData.categories && (catData.categories).map((category, index) => (
                        <li key={index}>
                            <Link to={`/shop/${category.name.split(" ").join("-").toLowerCase()}`} id={`${category.id}`} >{category.name}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    </>
  )
}

export default Header
