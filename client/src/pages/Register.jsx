import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { Link, useNavigate } from 'react-router-dom'

const baseURL = import.meta.env.VITE_NODE_URL

const Register = () => {

  const navigate = useNavigate()

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',

  }
  const [ formValues, setFormValues ] = useState({initialValues})
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

    if (!values.firstName) {
      errors.firstName = 'First name cannot be blank'
    } 

    if (!values.lastName) {
      errors.lastName = 'Last name cannot be blank'
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!values.email) {
      errors.email = 'Email cannot be blank'
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Enter a valid email address'
    }    

    if (!values.username) {
      errors.username = 'Username cannot be blank'
    }
    
    if (!values.password) {
      errors.password = 'Password cannot be blank'
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm password cannot be blank'
    }

    if (values.password != values.confirmPassword) {
      errors.confirmPassword = 'Confirm password must be same as password'
    }

    return errors
  }

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      signUpHandler()
    }
  }, [formErrors])


  const signUpHandler = async () => {
    const resp = await fetch(`${baseURL}/api/auth/createuser`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        username: formValues.username,
        password: formValues.password
      })
    })

    const json = await resp.json()

    if (json.success) {
      setResponse({
        message: json.message
      })

      loginUser()
    } else {
      setResponse({
        error: json.error
      })
    }

    setTimeout(() => {
      setResponse({})
    }, 4000);
  }


  const loginUser = async () => {
    const resp = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formValues.username,
        password: formValues.password
      })
    })

    const json = await resp.json();

    if (json.success) {
      
      setResponse({})
      localStorage.setItem("token", json.authToken)
      if (json.role == 2) {
        navigate('/account')
      } else {
        navigate('/')
      }

    } else {
      navigate("/login")
    }
  }
  
  const [ response, setResponse ] = useState({})

  return (
    <>
        <Header />
        <div className="auth-page row">
          { response.errors && <div className='alertError'>{response.errors}</div> }
          { response.error && <div className='alertError'>{response.error}</div> }
          { response.message && <div className='alertSuccess'>{response.message}</div> }
          <div className="page-card row">
            <div></div>
            <div>
              <h2 className='page-heading'>Registration Form</h2>
              <form action="" className='column gap1'>
                <div className="form-field">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" name='firstName' id='firstName' onChange={inputHandler}/>
                  { formErrors.firstName && <span className='form-field-error'>{ formErrors.firstName }</span> }
                </div>
                <div className="form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" name='lastName' id='lastName' onChange={inputHandler}/>
                  { formErrors.lastName && <span className='form-field-error'>{ formErrors.lastName }</span> }
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input type="email" name='email' id='email' onChange={inputHandler}/>
                  { formErrors.email && <span className='form-field-error'>{ formErrors.email }</span> }
                </div>
                <div className="form-field">
                  <label htmlFor="username">Username</label>
                  <input type="text" name='username' id='username' onChange={inputHandler}/>
                  { formErrors.username && <span className='form-field-error'>{ formErrors.username }</span> }
                </div>
                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <input type="password" name='password' id='password' onChange={inputHandler}/>
                  { formErrors.password && <span className='form-field-error'>{ formErrors.password }</span> }
                </div>
                <div className="form-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input type="password" name='confirmPassword' id='confirmPassword' onChange={inputHandler}/>
                  { formErrors.confirmPassword && <span className='form-field-error'>{ formErrors.confirmPassword }</span> }
                </div>
                <div className="row gap1">
                  <p>Already have an account? <Link to={"/login"}>Please Login</Link></p>
                  <button className='btn2' onClick={submissionHandler}>Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
    </>
  )
}

export default Register
