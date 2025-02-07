import React, { useEffect, useState } from 'react'
import styles from './Dash.module.css'
import ProfileIcon from '../../assets/images/profile.png'
const baseURL = import.meta.env.VITE_NODE_URL

const Profile = () => {
    // const initialValues = { firstName: "", lastName: "", email: "", phone: "", username: "",  password: ""}
    const [initialValues, setInitialValues] = useState(null);
    const [formValues, setFormValues] = useState({...initialValues});
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    useEffect(() => {
        document.title = "HH Power Tools | Dashboard"
        getProfile()
    }, [])

    const getProfile = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/auth/getuser`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })

            const json = await resp.json()
            if (json.success) {
                setInitialValues(json.data)
                setFormValues(json.data)
            } else {
                console.log(json.error)
            }
        }
    }
    
    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormValues({...formValues, [name]: value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setFormErrors(validate(formValues))
        setIsSubmit(true)
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            saveProfileHandler()
        }
    }, [formErrors])


    const validate = (values) => {
        const errors = {}

        if (!values.firstName) {
            errors.firstName = "First Name is required"
        }

        if (!values.lastName) {
            errors.lastName = "Last Name is required"
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!values.email) {
            errors.email = "Email is required"
        } else if (!emailRegex.test(values.email)) {
            errors.email = 'Enter a valid email address'
        }  

        if (!values.username) {
            errors.username = "Username is required"
        }
        
        return errors
    };

    const saveProfileHandler = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/auth/updateuser/${initialValues._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    email: formValues.email,
                    phone: formValues.phone,
                    username: formValues.username,
                    password: formValues.password
                })
            })

            const json = await resp.json()

            if (json.success) {
                setResponse({
                    message: json.message
                })
                getProfile()
            } else {
                setResponse({
                    error: json.error
                })
            }
            
            setTimeout(() => {
                setResponse({})
            }, 4000);

            
            setIsSubmit(false)
        }
    }
    
    const [ response, setResponse ] = useState({})

  return (
    <div className={`${styles.row} ${styles.gap2}`}>
        { response.errors && <div className={styles.alertError}>{response.errors}</div> }
        { response.error && <div className={styles.alertError}>{response.error}</div> }
        { response.message && <div className={styles.alertSuccess}>{response.message}</div> }
        <div className={`${styles.dPanel} ${styles.profile}`}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Profile Information</h2>
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <div className={styles.profileIcon}>
                    <img src={ProfileIcon} alt="" />
                </div>
                <div className={`${styles.row} ${styles.gap5}`}>
                    <div className={`${styles.column} ${styles.gap1}`}>
                        <p><span>Full Name: </span>{ initialValues && initialValues.firstName + ' ' + initialValues.lastName }</p>
                        <p><span>Email: </span>{  initialValues && initialValues.email }</p>
                        <p><span>Username: </span>{  initialValues && initialValues.username }</p>
                        <p><span>Contact No: </span>{ initialValues && initialValues.phone !== undefined ? '+92'+initialValues.phone : 'N/A' }</p>
                    </div>
                </div>
            </div>
        </div>
        <div className={`${styles.dPanel} ${styles.profile}`}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Profile Update</h2>
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <form action="" method="post" className={`${styles.column} ${styles.gap1}`} onSubmit={handleSubmit}>
                    <div className={`${styles.formGroup} ${styles.gap1}`}>
                        <div className={styles.formField}>
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" name='firstName' id='firstName' value={ formValues.firstName } onChange={changeHandler}/>
                            { <span className='form-field-error'>{ formErrors.firstName }</span> }
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" name='lastName' id='lastName' value={ formValues.lastName } onChange={changeHandler}/>
                            { <span className='form-field-error'>{ formErrors.lastName }</span> }
                        </div>
                    </div>
                    <div className={`${styles.formGroup} ${styles.gap1}`}>
                        <div className={styles.formField}>
                            <label htmlFor="email">Email</label>
                            <input type="email" name='email' id='email' value={ formValues.email } onChange={changeHandler}/>
                            { <span className='form-field-error'>{ formErrors.email }</span> }
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="phone">Phone</label>
                            <input type="tel" name='phone' id='phone' value={ formValues.phone } onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className={`${styles.formGroup} ${styles.gap1}`}>
                        <div className={styles.formField}>
                            <label htmlFor="username">Username</label>
                            <input type="text" name='username' id='username' value={ formValues.username } onChange={changeHandler}/>
                            { <span className='form-field-error'>{ formErrors.username }</span> }
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="password">Password</label>
                            <input type="password" name='password' id='password' value={ formValues.password } onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className={`${styles.column} ${styles.actions}`}>
                        <button className={styles.btn2} onClick={saveProfileHandler}>Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Profile
