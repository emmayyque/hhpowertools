import React, { useState } from 'react'
import styles from './Dash.module.css'
import { useEffect } from 'react'
import Pagination from '../components/dashboard/Pagination'
const baseURL = import.meta.env.VITE_NODE_URL

const Categories = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const [ idFromDb, setIdFromDb ] = useState()
    const [ categories, setCategories ] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ itemsPerPage, setItemsPerPage ] = useState(9)

    const [ modelStyle, setModelStyle ] = useState({
        transform: "translateY(-100%)",
        opacity: 0
    })

    // Add or Edit Button Handling 
    const [ actionHandler, setActionHandler ] = useState({
        addBtn: {
            display: "block"
        },
        editBtn: {
            display: "none"
        },
        deletePanel: {
            display: "none",
        },
        addPanel: {
            display: "block",
        }
    })

    const showPanel = (e) => {
        e.preventDefault()

        setModelStyle({
            transform: "translateY(0)",
            opacity: 1
        })

        if (e.target.name == 'addBtn') {
            setActionHandler({
                addBtn: {
                    display: "block"
                },
                editBtn: {
                    display: "none"
                },
                deletePanel: {
                    display: "none",
                },
                addPanel: {
                    display: "block",
                }
            })
        } else if (e.target.name == 'editBtn') {
            setActionHandler({
                addBtn: {
                    display: "none"
                },
                editBtn: {
                    display: "block"
                },
                deletePanel: {
                    display: "none",
                },
                addPanel: {
                    display: "block",
                }
            })
            setIdFromDb(e.target.id)
            getCategory(e.target.id)
            setImagePrev
        } else if (e.target.name == 'deleteBtn') {
            setActionHandler({
                addBtn: {
                    display: "none"
                },
                editBtn: {
                    display: "none"
                },
                deletePanel: {
                    display: "block",
                },
                addPanel: {
                    display: "none",
                },
                reStockPanel: {
                    display: "none",
                }
            })
            setIdFromDb(e.target.id)
            getCategory(e.target.id)
            
        } 
        
    }

    const getCategory = async (id) => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/category/getone/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
            
            if (json.success) {
                setFormValues(json.data)
                setImagePrev(baseURL+json.data.imageUrl)
            } else {
                console.log(json)
            }
        }
    }

    const getCategories = async () => {
        const resp = await fetch(`${baseURL}/api/category/getall`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        const json = await resp.json()

        if (json.success) {
            setCategories(json.data)
        } else {
            console.log(json)
        }
    }

    useEffect(() => {
        document.title = "HH Power Tools | Categories"
        getCategories()
    }, [])

    setTimeout(()=> {
        setIsLoading(false)
    }, 50)

    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const currentCategories = categories.slice(firstIndex, lastIndex)

    const hidePanel = (e) => {
        if (e) {
            e.preventDefault()
        }
        setModelStyle({
            transform: "translateY(-100%)",
            opacity: 0
        })
        setIsSubmit(false)
        setFormErrors({})
        setFormValues(initialValues)
        setImagePrev(null)
        setCatImage(null)
    }
    
    // Add new Category
    const initialValues = {
        name: '',
        categoryImg: ''
    }
    const [ formValues, setFormValues ] = useState({...initialValues})
    const [ formErrors, setFormErrors ] = useState({})
    const [ isSubmit, setIsSubmit ] = useState(false)
    const [ catImage, setCatImage ] = useState(null)
    const [ imagePrev, setImagePrev ] = useState(null)

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormValues({...formValues, [name]: value})
    }

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => { setImagePrev(event.target.result) }
            reader.readAsDataURL(file)
            setCatImage(file)
        } 
    }

    const submissionHandler = (e) => {
        e.preventDefault()
        setFormErrors(validate(formValues))
        setIsSubmit(true)
    }

    const editHandler = async (e) => {
        e.preventDefault() 
        const token = localStorage.getItem("token")
        if (token) {
            const fd = new FormData(document.getElementById('categoryForm'))
            const resp = await fetch(`${baseURL}/api/category/update/${idFromDb}`, {
                method: "PUT",
                headers: {
                    "auth-token": token
                },
                credentials: "include",
                body: fd
            })
    
            const json = await resp.json()
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getCategories()
                hidePanel()
            } else {
                if (!json.success) {
                    setResponse({
                        error: json.message
                    })
                } else {
                    setResponse({
                        error: json.error
                    })
                }
            }
    
            setTimeout(() => {
                setResponse({})
            }, 4000)
        }        
    }

    const deleteHandler = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/category/delete/${idFromDb}`, {
                method: "DELETE",
                headers: {
                    "auth-token": token
                },
            })
    
            const json = await resp.json()
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getCategories()
                hidePanel()
            } else {
                if (!json.success) {
                    setResponse({
                        error: json.message
                    })
                } else {
                    setResponse({
                        error: json.error
                    })
                }
            }
    
            setTimeout(() => {
                setResponse({})
            }, 4000)            
        }
    }

    const addCategory = async () => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            const token = localStorage.getItem("token")
            if (token) {
                const fd = new FormData(document.getElementById('categoryForm'))
                const resp = await fetch(`${baseURL}/api/category/add`, {
                    method: "POST",
                    headers: {
                        "auth-token": token
                    },
                    credentials: "include",
                    body: fd
                })
    
                const json = await resp.json()
                console.log(resp + "Resp")
                console.log(json + "Json")

                if (json.success) {
                    setResponse({
                        message: json.message
                    })
                    getCategories()
                    hidePanel()
                } else {
                    if (!json.success) {
                        setResponse({
                            error: json.message
                        })
                    } else {
                        setResponse({
                            error: json.error
                        })
                    }
                }
    
                setTimeout(() => {
                    setResponse({})
                }, 4000)
            }
        }
    }
    

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            addCategory()
        }
    }, [formErrors])

    const validate = (values) => {
        const errors = {}


        if (!values.name) {
            errors.name = "Category name is required"
        } else if (values.name.length < 4) {
            errors.name = "Category name must be of 4 characters"
        }

        if (!catImage) {
            errors.imageUrl = "Category image is required"
        }

        return errors
    }

    const [ response, setResponse ] = useState({})

    const dateFormatter = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    }

  return (
    isLoading ? '' :
    <>
        { response.errors && <div className={styles.alertError}>{response.errors}</div> }
        { response.error && <div className={styles.alertError}>{response.error}</div> }
        { response.message && <div className={styles.alertSuccess}>{response.message}</div> }
        <div className={styles.overlay} style={modelStyle}>
            <div className={`${styles.model}`} >
                <form action="" method="post" style={actionHandler.addPanel} id='categoryForm' encType='multipart/form-data'>
                    <div className={`${styles.column} ${styles.gap1}`}>
                        <div className={styles.formField}>
                            <label htmlFor="name">Category Name</label>
                            <input type="text" name='name' id='name' value={formValues.name} onChange={handleInput}/>
                            { <span className='form-field-error'>{ formErrors.name }</span> }
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="image">Category Image</label>
                            <div className={styles.fileUpload}>
                                <input type="file" className={styles.upload} name='categoryImg' id='categoryImg' onChange={handleImage}/>
                                <span>+</span>
                                { imagePrev && <img src={imagePrev} alt="" /> }
                            </div>
                            { <span className='form-field-error'>{ formErrors.imageUrl }</span> }
                        </div>
                    </div>
                    <hr style={{margin: '10px 0px'}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <button className={styles.btn3} onClick={hidePanel}>Cancel</button>
                        <button className={styles.btn2} onClick={submissionHandler} style={actionHandler.addBtn}>Add Category</button>
                        <button className={styles.btn2} onClick={editHandler} style={actionHandler.editBtn}>Update Category</button>
                    </div>
                </form>
                <form action="" style={actionHandler.deletePanel} className={`${styles.column} ${styles.gap2}`}>
                    <p>Are your sure to delete?</p>
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <a href="" className={`${styles.btn3}`} onClick={hidePanel}>Cancel</a>
                        <a href="" className={`${styles.btn2}`} onClick={deleteHandler}>Yes, Delete</a>
                    </div>
                </form>
            </div>
        </div>
        <div className={styles.dPanel}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Categories</h2>
                <a href="" className={styles.btn2} onClick={showPanel} name='addBtn'>Add New Category</a>
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Category</th>
                                <th>Name</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentCategories && currentCategories.map((category, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className={styles.tableImage}>
                                                <img src={`${baseURL}${category.imageUrl}`} alt="Product" />
                                            </div>
                                        </td>
                                        <td>{category.name}</td>
                                        <td>{dateFormatter(category.createdAt)}</td>
                                        <td>{dateFormatter(category.updatedAt)}</td>
                                        <td className={`${styles.row} ${styles.gap0}`}>
                                            <a href="" className={`${styles.btn} ${styles.primaryBtn}`} id={category._id} onClick={showPanel} name='editBtn'>Edit</a>
                                            <a href="" className={`${styles.btn} ${styles.dangerBtn}`} id={category._id} onClick={showPanel} name='deleteBtn'>Delete</a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    <Pagination totalItems={categories.length} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                </div>
            </div>
        </div>
    </>
  )
}

export default Categories
