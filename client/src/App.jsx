import './App.css'
import LandingPage from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import ScrollToTop from './pages/components/ScrollToTop'
import Cart from './pages/Cart'
import CartState from './context/cart/CartState'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Dashboard from './pages/Admin/Dashboard'
import CategoryProvider from './context/categories/CategoryProvider'
import UserProvider from './context/user/UserProvider'
import Tracking from './pages/Tracking'
import ProtectedRoute from './pages/components/ProtectedRoute'
import AdminProtectedRoute from './pages/components/dashboard/AdminProtectedRoute'
import { useEffect } from 'react'
import Page404 from './pages/Page404'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'


function App() {
  
  // useEffect(() => {
  //     document.title = "HH Power Tools"
  // }, [])

  return ( 
    <BrowserRouter scrollRestoration="auto">
    <CartState>      
    <ScrollToTop />
    <CategoryProvider>
    <UserProvider>
      <Routes>
        <Route index element={ <LandingPage /> } /> 
        <Route path='/account' element={ <ProtectedRoute> <Account /> </ProtectedRoute> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/register' element={ <Register /> } />
        <Route path='/shop' element={ <Shop /> } />
        <Route path='/shop/:category/*' element={ <Shop /> } />
        <Route path='/shop/product/:prodName' element={ <ProductPage /> } />
        <Route path='/shop/cart' element={ <Cart /> } />
        <Route path='/shop/checkout' element={ <Checkout /> } />
        <Route path='/tracking' element={ <Tracking /> } />
        <Route path='/Admin/Dashboard/*' element={ <AdminProtectedRoute> <Dashboard /> </AdminProtectedRoute> } />
        <Route path='/about-us' element={ <AboutUs /> } />
        <Route path='/contact-us' element={ <ContactUs /> } />
        <Route path='/*' element={ <Page404 /> } />
      </Routes>
    </UserProvider>
    </CategoryProvider>
    </CartState>
    </BrowserRouter>
  )
}

export default App
