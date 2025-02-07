import React from 'react'
import Logo from '../../../assets/images/logo3.png'
import MobLogo from '../../../assets/images/logo3-mob.png'
import styles from '../../Admin/Dash.module.css'
import * as Icons from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const logoutHandler = async (e) => {
        e.preventDefault()
        localStorage.clear()
        navigate("/")
    }

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={`${styles.logo}`}>
            <img src={Logo} alt="Companies's Logo" />
        </div>
        <div className={`${styles.mobLogo}`}>
            <img src={MobLogo} alt="Companies's Logo" />
        </div>
        <div className={styles.seperator}></div>
        <nav>
            <ul className={`${styles.column} ${styles.gap2}`}>
                <li>
                    <Link to={"/Admin/Dashboard"} className={`${styles.row} ${styles.gap2} ${ location.pathname === '/Admin/Dashboard' ? `${styles.active}` : ''}`}>
                        <Icons.FaStore className={styles.icon1}/>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/Admin/Dashboard/Categories"} className={`${styles.row} ${styles.gap2} ${ location.pathname === '/Admin/Dashboard/Categories' ? `${styles.active}` : ''}`}>
                        <Icons.FaAlignJustify className={styles.icon1}/>
                        <span>Categories</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/Admin/Dashboard/Customers"} className={`${styles.row} ${styles.gap2} ${ location.pathname === '/Admin/Dashboard/Customers' ? `${styles.active}` : ''}`}>
                        <Icons.FaUsers className={styles.icon1}/>
                        <span>Customers</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/Admin/Dashboard/Products"} className={`${styles.row} ${styles.gap2} ${ location.pathname === '/Admin/Dashboard/Products' ? `${styles.active}` : ''}`}>
                        <Icons.FaBoxOpen className={styles.icon1}/>
                        <span>Products</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/Admin/Dashboard/Orders"} className={`${styles.row} ${styles.gap2} ${ location.pathname === '/Admin/Dashboard/Orders' ? `${styles.active}` : ''}`}>
                        <Icons.FaBagShopping className={styles.icon1}/>
                        <span>Orders</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/Admin/Dashboard/Reviews"} className={`${styles.row} ${styles.gap2} ${ location.pathname === '/Admin/Dashboard/Reviews' ? `${styles.active}` : ''}`}>
                        <Icons.FaRegCommentDots className={styles.icon1}/>
                        <span>Reviews</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/Admin/Dashboard/Miscellaneous"} className={`${styles.row} ${styles.gap2} ${ location.pathname === '/Admin/Dashboard/Miscellaneous' ? `${styles.active}` : ''}`}>
                        <Icons.FaGear className={styles.icon1}/>
                        <span>Miscellaneous</span>
                    </Link>
                </li>
            </ul>
            <h2 className={styles.sidebarSectionHeading}>Acccount Pages</h2>
            <ul className={`${styles.column} ${styles.gap2}`}>
                <li>
                    <Link to={"/Admin/Dashboard/Profile"} className={`${styles.row} ${styles.gap2} ${ location.pathname === '/Admin/Dashboard/Profile' ? `${styles.active}` : ''}`}>
                        <Icons.FaUser className={styles.icon1}/>
                        <span>Profile</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/"} className={`${styles.row} ${styles.gap2}`} onClick={logoutHandler}>
                        <Icons.FaArrowRightFromBracket className={styles.icon1}/>
                        <span>Logout</span>
                    </Link>
                </li>
            </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
