import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const baseURL = import.meta.env.VITE_NODE_URL

const Profile = () => {

  const initialValues = {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    phone: '',
  }
  const [ formValues, setFormValues ] = useState({...initialValues})
  const [ formErrors, setFormErrors ] = useState({})
  const [ isSubmit, setIsSubmit ] = useState(false)

  const getUser = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${baseURL}/api/auth/getuser`, {
        method: 'POST', 
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      })

      const json = await resp.json()
      if (json.success) {
        setFormValues(json.data)
      } else {
        console.log(json.error)
      }
    }    
  }  

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit ) {
      saveProfileHandler(formValues._id)
    }
  }, [formErrors])

  const handleInput = (e) => {
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

    return errors    
  }

  const saveProfileHandler = async (id) => {
    const token = localStorage.getItem("token")
    if (token) {
      const resp = await fetch(`${baseURL}/api/auth/updateuser/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName, 
          email: formValues.email,
          username: formValues.username,
          password: formValues.password,
          phone: formValues.phone,
        })
      })

      const json = await resp.json()

      if ( json.success ) { 
        setResponse({
          message: json.message
        })
      } else {
        setResponse({
          error: json.error
        })
      }

      setTimeout(() => {
        setResponse({})
      }, 4000)
    }
  }

  
  const [ response, setResponse ] = useState({})

  return (
    <div className='profile'>
      { response.errors && <div className='alertError'>{response.errors}</div> }
      { response.error && <div className='alertError'>{response.error}</div> }
      { response.message && <div className='alertSuccess'>{response.message}</div> }
      <form action="" className='column gap1'>
        <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <input type="text" name='firstName' id='firstName' value={formValues.firstName} onChange={handleInput}/>
            { formErrors.firstName && <span className='form-field-error'>{ formErrors.firstName }</span> }
        </div>
        <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" name='lastName' id='lastName' value={formValues.lastName} onChange={handleInput}/>
            { formErrors.lastName && <span className='form-field-error'>{ formErrors.lastName }</span> }
        </div>
        <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' value={formValues.email} onChange={handleInput}/>
            { formErrors.email && <span className='form-field-error'>{ formErrors.email }</span> }
        </div>
        <div className="form-field">
            <label htmlFor="username">Username</label>
            <input type="text" name='username' id='username' value={formValues.username} onChange={handleInput}/>
            { formErrors.username && <span className='form-field-error'>{ formErrors.username }</span> }
        </div>
        <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" name='password' id='password' value={formValues.password} onChange={handleInput} autoComplete="nope" />
        </div>
        <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input type="tel" name='phone' id='phone' value={formValues.phone} onChange={handleInput}/>
        </div>
        <div className="row gap1">
            <button className='btn2' onClick={submissionHandler}>Save Profile</button>
        </div>
      </form>
    </div>
  )
}

export default Profile
