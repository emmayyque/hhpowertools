import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import Banner from '../assets/images/banners/banner1.jpg'
import { useContext } from 'react'
import UserContext from '../context/user/UserContext'
const baseURL = import.meta.env.VITE_NODE_URL

const Login = () => {
  const navigate = useNavigate()
  const userData = useContext(UserContext)

  useEffect(() => {
    document.title = "HH Power Tools | Login"
  }, [])

  const initialValues = {
    username: '',
    password: ''
  }

  const [ formValues, setFormValues ] = useState({...initialValues})
  const [ formErrors, setFormErrors ] = useState({})
  const [ isSubmit, setIsSubmit ] = useState(false)

  const inputHandler = (e) => {
    const { name, value } = e.target
    setFormValues({...formValues, [name]: value})
  }

  const submissionHandler = (e) => {
    e.preventDefault()
    setFormErrors(validate(formValues))
    setIsSubmit(true)
  }

  const validate = (values) => {
    const errors = {}
    
    if (!values.username) {
      errors.username = 'Username is required'
    } 

    if (!values.password) {
      errors.password = 'Password is required'
    }

    return errors
  }

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      loginHandler()
    }

  }, [formErrors])

  const loginHandler = async () => {
    const resp = await fetch(`${baseURL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formValues.username,
        password: formValues.password
      })
    })

    const json = await resp.json()

    if (json.success) {      
      setResponse({})
      localStorage.setItem("token", json.authToken)
      if (json.role == 1) {
        navigate('/Admin/Dashboard')
      } else if (json.role == 2) {
        navigate('/')
      }
    } else {
      setResponse({
        error: json.error
      })
    }
  }

  const [ response, setResponse ] = useState({})

  return (
    <>
        <Header />
        <div className="auth-page row">
          <div className="page-card row">
            <div></div>
            <div>
              <h2 className='page-heading'>Login Form</h2>
              <form action="" className='column gap1'>
                <div className="form-field">
                  <label htmlFor="username">Username</label>
                  <input type="text" name='username' id='username' value={formValues.username} onChange={inputHandler} />
                  { formErrors.username && <span className="form-field-error">{formErrors.username}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <input type="password" name='password' id='password' value={formValues.password} onChange={inputHandler} />
                  { formErrors.password && <span className="form-field-error">{formErrors.password}</span>}
                </div>
                <div className="row gap0 remember">
                  <input type="checkbox" name='remember' id='remember' style={{border: '2px solid #000000'}}/>
                  <label htmlFor="">Remember me?</label>
                </div>
                { response.error && <div className='form-field-error'>{response.error}</div> }
                <div className="row gap1">
                  <p>New User? <Link to={"/register"}>Please Register</Link></p>
                  <button className='btn2' onClick={submissionHandler}>Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
    </>
  )
}

export default Login
