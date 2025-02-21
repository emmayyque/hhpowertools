import React, { useContext, useEffect, useState } from 'react'
import styles from './Dash.module.css'
import * as Icons from 'react-icons/fa6'
import Pagination from '../components/dashboard/Pagination'
import CategoryContext from '../../context/categories/CategoryContext'
const baseURL = import.meta.env.VITE_NODE_URL

const Products = () => {
    let title = "Add Product"
    
    const catData = useContext(CategoryContext)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ idFromDb, setIdFromDb ] = useState()
    const [ products, setProducts ] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ itemsPerPage, setItemsPerPage ] = useState(9)

    const getProducts = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/product/getallproducts`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setProducts(json.data)
            } else {
                console.log(json)
            }
        }
    }

    useEffect(() => {
        getProducts()
    }, [])

    const initialSpecs = {
        _id: 1,
        name: "",
        value: "",
    }

    const [ specs, setSpecs ] = useState([initialSpecs])

    const addMoreSpecRowHandler = (e) => {
        let specId = e.target.closest('tr').id
        if (Number(e.target.closest('tr').id)) {
            specId = Number(e.target.closest('tr').id)
        } 
        setSpecs([...specs, {_id: specs.length + 1, name: "", value: ""}])
    }

    const removeSpecRowHandler = (e) => {
        let specId = e.target.closest('tr').id
        if (Number(e.target.closest('tr').id)) {
            specId = Number(e.target.closest('tr').id)
        }      
        setSpecs(specs.filter( spec => spec._id !== specId))
    }

    const specInputHandler = (e) => {
        let specId = e.target.closest('tr').id
        if (Number(e.target.closest('tr').id)) {
            specId = Number(e.target.closest('tr').id)
        } 
        const { name, value } = e.target
        if (name == 'specLabels[]') {
            setSpecs(
                specs.map(spec => 
                    spec._id === specId ? { ...spec, name: value } : spec
                )
            )
        } else if (name == 'specValues[]') {
            setSpecs(
                specs.map(spec => 
                    spec._id === specId ? { ...spec, value: value } : spec
                )
            )
        }
        
    }

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
        },
        reStockPanel: {
            display: "none",
        }
    })
    
    useEffect(() => {
        document.title = "HH Power Tools | Products"
    }, [])

    setTimeout(()=> {
        setIsLoading(false)
    }, 50)

    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const currentProducts = products.slice(firstIndex, lastIndex)

    const getFormat = (value) => {
        return (
            (value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )
    }

    const getDiscountedPrice = (cost, disc) => {
        let discVal = (cost * disc) / 100
        return (
        cost - discVal
        )
    }  

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
                },
                reStockPanel: {
                    display: "none",
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
                },
                reStockPanel: {
                    display: "none",
                }
            })
            setIdFromDb(e.target.id)
            getProduct(e.target.id)
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
            getProduct(e.target.id)
        } else if (e.target.name == 'restockBtn') {
            setActionHandler({
                addBtn: {
                    display: "none"
                },
                editBtn: {
                    display: "none"
                },
                deletePanel: {
                    display: "none",
                },
                addPanel: {
                    display: "none",
                },
                reStockPanel: {
                    display: "block",
                }
            })
            setIdFromDb(e.target.id)
            getProduct(e.target.id)
        }
        
    }


    const getProduct = async (id) => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/product/getonewithspecs/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {            
                setFormValues(json.data.product)
                if (json.data.specifications.length > 0) {
                    setSpecs([...specs,...json.data.specifications])
                }
                if (json.data.product.images[0]) {
                    setImage1Prev(baseURL+json.data.product.images[0].imageUrl)
                }
                if (json.data.product.images[1]) {
                    setImage2Prev(baseURL+json.data.product.images[1].imageUrl)
                }
                if (json.data.product.images[2]) {
                    setImage3Prev(baseURL+json.data.product.images[2].imageUrl)
                }
                if (json.data.product.images[3]) {
                    setImage4Prev(baseURL+json.data.product.images[3].imageUrl)
                }
                if (json.data.product.images[4]) {
                    setImage5Prev(baseURL+json.data.product.images[4].imageUrl)            
                }
                if (json.data.product.images[5]) {
                    setImage6Prev(baseURL+json.data.product.images[5].imageUrl)
                }            
            } else {
                console.log(json.error)
            }
        }
    }
  
    //  To Add a New Product
    const initialValues = { 
        name: '',
        description: '',
        features: '',
        applications: '',
        costPrice: '',
        discount: '',
        quantity: '',
        weight: '',
        category: 0,
        image_url: '',
    }

    const [ formValues, setFormValues ] = useState({...initialValues})
    const [ formErrors, setFormErrors ] = useState({})
    const [ isSubmit, setIsSubmit ] = useState(false)
    const [ isImage, setIsImage ] = useState(false)

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormValues({...formValues, [name]: value})
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
            const fd = new FormData(document.getElementById('productForm'))
            const resp = await fetch(`${baseURL}/api/product/update/${idFromDb}`, {
                method: "PUT",
                headers: {
                    "auth-token": token
                },
                body: fd     
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getProducts()
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
            const resp = await fetch(`${baseURL}/api/product/delete/${idFromDb}`, {
                method: "DELETE",
                headers: {
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
            
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getProducts()
                hidePanel()
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

    const restockHandler = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/product/restock/${idFromDb}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({
                    quantity: formValues.quantity
                })
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getProducts()
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

    const [ image1Prev, setImage1Prev ] = useState(null)
    const [ image2Prev, setImage2Prev ] = useState(null)
    const [ image3Prev, setImage3Prev ] = useState(null)
    const [ image4Prev, setImage4Prev ] = useState(null)
    const [ image5Prev, setImage5Prev ] = useState(null)
    const [ image6Prev, setImage6Prev ] = useState(null)
    

    const handleImage = (e) => {
        const file = e.target.files[0];
        // console.log(e.target.result)
        if (file) {
            // console.log("hey inside")
            const reader = new FileReader()
            // console.log(file)
            reader.onload = (event) => {
                if (e.target.name == 'image1') {
                    setImage1Prev(event.target.result)
                } else if (e.target.name == 'image2') {
                    setImage2Prev(event.target.result)
                } else if (e.target.name == 'image3') {
                    setImage3Prev(event.target.result)
                } else if (e.target.name == 'image4') {
                    setImage4Prev(event.target.result)
                } else if (e.target.name == 'image5') {
                    setImage5Prev(event.target.result)
                } else if (e.target.name == 'image6') {
                    setImage6Prev(event.target.result)
                }
            }
            reader.readAsDataURL(file)            
            setIsImage(true)
        } 
    }

    const addProduct = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const fd = new FormData(document.getElementById('productForm'))
            const resp = await fetch(`${baseURL}/api/product/add`, {
                method: "POST",
                headers: {
                    "auth-token": token
                },
                body: fd     
            })
    
            const json = await resp.json()

            console.log(resp)
    
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getProducts()
                hidePanel()
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

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            addProduct()
        }
        // console.log(formErrors)
    }, [formErrors])

    const validate = (values) => {
        const errors = {}
        const regex = /^\d+$/

        if (!values.name) {
            errors.name = 'Product name field is required'
        }

        if (!values.description) {
            errors.description = 'Product description is required'
        }

        if (!values.costPrice) {
            errors.costPrice = 'Cost price is required'
        }

        if (values.costPrice != '' && !regex.test(values.costPrice)) {
            errors.costPrice = 'Cost price can be numeric only'
        }

        if (values.discount != '' && !regex.test(values.discount)) {
            errors.discount = 'Discount can be numeric only'
        }

        if (!values.quantity) {
            errors.quantity = 'Quantity field is required'
        }

        if (values.quantity != '' && !regex.test(values.quantity)) {
            errors.quantity = 'Quantity can be numeric only'
        }

        if (!values.weight) {
            errors.weight = 'Weight field is required'
        }

        if (!values.category) {
            errors.category = 'Category must be selected'
        }

        if (!isImage) {
            errors.image = "Add at least 1 image"
        }

        return errors
    }

    const hidePanel = (e) => {
        if (e) {
            e.preventDefault()
        }
        
        setModelStyle({
            transform: "translateY(-100%)",
            opacity: 0
        })
        setIsSubmit(false)
        setIsImage(false)
        setFormErrors({})
        setFormValues({...initialValues})
        setSpecs([initialSpecs])
        setImage1Prev(null)
        setImage2Prev(null)
        setImage3Prev(null)
        setImage4Prev(null)
        setImage5Prev(null)
        setImage6Prev(null)
    }

    const searchHandler = async (e) => {
        const { name, value } = e.target
        if (e.target.value == '') {
            getProducts()
        } else {
            const token = localStorage.getItem("token")
            if (token) {
                const resp = await fetch(`${baseURL}/api/product/searchproduct/${value}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    }
                })
    
                const json = await resp.json()
                if (json.success) {
                    setProducts(json.data)
                } else {
                    console.log(json)
                }
            }
        }
    }

    const activeHandler = async (e) => {
        e.preventDefault()
        const id = e.target.id
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/product/active/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getProducts()
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

    const inActiveHandler = async (e) => {
        e.preventDefault()
        const id = e.target.id
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/product/inactive/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setResponse({
                    message: json.message
                })
                getProducts()
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

    
    const [ response, setResponse ] = useState({})
    
  return (
    isLoading ? '' :
    <>
        { response.errors && <div className={styles.alertError}>{response.errors}</div> }
        { response.error && <div className={styles.alertError}>{response.error}</div> }
        { response.message && <div className={styles.alertSuccess}>{response.message}</div> }
        <div className={styles.overlay} style={modelStyle}>
            <div className={`${styles.productModel} ${styles.model}`} >
                <form method="post" className={`${styles.column} ${styles.gap2}`}  style={actionHandler.addPanel} id='productForm'>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <div className={`${styles.column} ${styles.gap1}`}>
                            <div className={styles.formField}>
                                <label htmlFor="name">Product Name</label>
                                <input type="text" name='name' id='name' value={formValues.name || ""} onChange={handleInput}/>
                                { <span className='form-field-error'>{ formErrors.name }</span> }
                            </div>
                            <div className={styles.formField}>
                                <label htmlFor="description">Product Description</label>
                                <textarea name="description" id="description" rows={7} cols={40} value={formValues.description} onChange={handleInput}></textarea>
                                { <span className='form-field-error'>{ formErrors.description }</span> }
                            </div>
                            <div className={styles.formField}>
                                <label htmlFor="features">Features</label>
                                <textarea name="features" id="features" rows={5} cols={40} value={formValues.features} onChange={handleInput}></textarea>
                            </div>
                            <div className={styles.formField}>
                                <label htmlFor="applications">Applications</label>
                                <textarea name="applications" id="applications" rows={5} cols={40} value={formValues.applications} onChange={handleInput}></textarea>
                            </div>
                        </div>
                        <div className={`${styles.column} ${styles.gap1}`}>
                            <div className={`${styles.formGroup} ${styles.gap1}`}>
                                <div className={styles.formField}>
                                    <label htmlFor="costPrice">Cost Price</label>
                                    <input type="number " name='costPrice' id='costPrice' value={formValues.costPrice} onChange={handleInput}/>
                                    { <span className='form-field-error'>{ formErrors.costPrice }</span> }
                                </div>
                                <div className={styles.formField}>
                                    <label htmlFor="weight">Weight</label>
                                    <input type="text " name='weight' id='weight' value={formValues.weight} onChange={handleInput}/>
                                    { <span className='form-field-error'>{ formErrors.weight }</span> }
                                </div>
                                <div className={styles.formField}>
                                    <label htmlFor="discount">Discount</label>
                                    <input type="number " name='discount' id='discount' value={formValues.discount} onChange={handleInput}/>
                                    { <span className='form-field-error'>{ formErrors.discount }</span> }
                                </div>
                                <div className={styles.formField}>
                                    <label htmlFor="quantity">Quantity</label>
                                    <input type="number " name='quantity' id='quantity' min={"1"} value={formValues.quantity} onChange={handleInput} />
                                    { <span className='form-field-error'>{ formErrors.quantity }</span> }
                                </div>
                                <div className={styles.formField}>
                                    <label htmlFor="category">Category</label>
                                    <select name="category" id="category" value={formValues.category} onChange={handleInput}>
                                        <option value="0">Select Category</option>
                                        {
                                            catData.categories && catData.categories.map((category, index) => (
                                                <option value={`${category._id}`} key={index}>{category.name}</option>
                                            ))
                                        }
                                    </select>
                                    { <span className='form-field-error'>{ formErrors.category }</span> }
                                </div>
                            </div>
                            <div className={styles.formField}>
                                <label htmlFor="category">Add Product Images (Upto 6 Images)</label>
                                <div className={`${styles.row} ${styles.gap2} ${styles.flexWrap}`}>
                                    <div className={styles.fileUpload}>
                                        { image1Prev && <img src={image1Prev} alt="" />}
                                        <input type="file" className={styles.upload} name='image1' id='image1' onChange={handleImage}/>
                                        <span>+</span>
                                    </div>
                                    <div className={styles.fileUpload}>
                                        <input type="file" className={styles.upload} name='image2' id='image2' onChange={handleImage}/>
                                        <span>+</span>
                                        { image2Prev && <img src={image2Prev} alt="" />}
                                    </div>
                                    <div className={styles.fileUpload}>
                                        <input type="file" className={styles.upload} name='image3' id='image3' onChange={handleImage}/>
                                        <span>+</span>
                                        { image3Prev && <img src={image3Prev} alt="" />}
                                    </div>
                                    <div className={styles.fileUpload}>
                                        <input type="file" className={styles.upload} name='image4' id='image4' onChange={handleImage}/>
                                        <span>+</span>
                                        { image4Prev && <img src={image4Prev} alt="" />}
                                    </div>
                                    <div className={styles.fileUpload}>
                                        <input type="file" className={styles.upload} name='image5' id='image5' onChange={handleImage}/>
                                        <span>+</span>
                                        { image5Prev && <img src={image5Prev} alt="" />}
                                    </div>
                                    <div className={styles.fileUpload}>
                                        <input type="file" className={styles.upload} name='image6' id='image6' onChange={handleImage}/>
                                        <span>+</span>
                                        { image6Prev && <img src={image6Prev} alt="" />}
                                    </div>                                    
                                </div>                                
                                { <span className='form-field-error'>{ formErrors.image }</span> }
                            </div>
                            <div className={styles.formField}>
                                <label htmlFor="productName">Product Specification</label>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Aspect</th>
                                            <th>Value</th>
                                            <th>More?</th>
                                        </tr>
                                    </thead>                            
                                    <tbody>
                                        {
                                            specs && specs.map((spec, index) => (
                                                <tr key={index} id={`${spec._id}`}>
                                                    <td>
                                                        <input type="text" name='specLabels[]' id='name' value={spec.name} onChange={specInputHandler}/>
                                                    </td>
                                                    <td>
                                                        <input type="text" name='specValues[]' id='value' value={spec.value} onChange={specInputHandler}/>
                                                    </td>
                                                    <td>
                                                        { 
                                                            spec._id == 1 ? 
                                                            <Icons.FaPlus className={styles.icon4} onClick={addMoreSpecRowHandler}/> :
                                                            <Icons.FaXmark className={`${styles.icon4} ${styles.icon4red}`} onClick={removeSpecRowHandler}/>
                                                        }                                                        
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <button className={styles.btn3} onClick={hidePanel}>Cancel</button>
                        <button className={styles.btn2} onClick={submissionHandler} style={actionHandler.addBtn}>Add Product</button>
                        <button className={styles.btn2} onClick={editHandler} style={actionHandler.editBtn}>Update Product</button>
                    </div>
                </form>
                <form action="" style={actionHandler.deletePanel} className={`${styles.column} ${styles.gap2}`}>
                    <p>Are your sure to delete?</p>
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <a href="" className={`${styles.btn3}`} onClick={hidePanel}>Cancel</a>
                        <a href="" className={`${styles.btn2}`} onClick={deleteHandler} >Yes, Delete</a>
                    </div>
                </form>
                <form action="" style={actionHandler.reStockPanel} className={`${styles.column} ${styles.gap2}`}>
                    <div className={styles.formField}>
                        <label htmlFor="">Quantity</label>
                        <input type="number" name='quantity' id='quantity' value={formValues.quantity} onChange={handleInput} />
                    </div>
                    <hr style={{margin: "10px 0px"}}/>
                    <div className={`${styles.row} ${styles.gap1}`}>
                        <a href="" className={`${styles.btn3}`} onClick={hidePanel}>Cancel</a>
                        <a href="" className={`${styles.btn2}`} onClick={restockHandler} >Save</a>
                    </div>
                </form>
            </div>
        </div>
        <div className={styles.dPanel}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Products</h2>
                <input type="text" placeholder='Search something here...' className={styles.searchField} onChange={searchHandler} />
                <a href="" className={styles.btn2} onClick={showPanel} name="addBtn">Add New Product</a>
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sr.</th>
                            <th>Product</th>
                            <th>Name</th>
                            <th>In Stock</th>
                            <th>C. Price</th>
                            <th>S. Price</th>
                            <th>Discount</th>
                            <th>Category</th>
                            <th>Is Active</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentProducts && currentProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{ index + 1 }</td>
                                    <td>
                                        <div className={styles.tableImage}>
                                            <img src={`${baseURL}${product.images[0].imageUrl}`} alt="Product" />
                                        </div>
                                    </td>
                                    <td>{ product.name }</td>
                                    <td>{ product.quantity }</td>
                                    <td>Rs. { getFormat(product.costPrice) }</td>
                                    <td>Rs. { getFormat(getDiscountedPrice(product.costPrice, product.discount)) }</td>
                                    <td>{ product.discount }%</td>
                                    <td>{ product.category && product.category.name }</td>
                                    <td>
                                        <span className={`${styles.badge} ${ product.isActive == 1 ? `${styles.successBadge}` : `${styles.warningBadge}`}`}>{ product.isActive == 1 ? 'True' : 'False'}</span>
                                    </td>
                                    <td>{ product.createdAt }</td>
                                    <td>{ product.updatedAt }</td>
                                    <td className={`${styles.column} ${styles.gap0}`}>
                                        <a href="" className={`${styles.btn} ${product.isActive == 1 ? `${styles.warningBtn}` : `${styles.primaryBtn}`}`} id={ product._id } onClick={product.isActive == 1 ? inActiveHandler : activeHandler } >
                                            {product.isActive == 1 ? 'Inactive' : 'Active'}
                                        </a>
                                        <a href="" className={`${styles.btn} ${styles.primaryBtn}`} id={ product._id } onClick={showPanel} name="editBtn">Edit</a>
                                        <a href="" className={`${styles.btn} ${styles.dangerBtn}`} id={ product._id } onClick={showPanel} name='deleteBtn' >Delete</a>
                                        <a href="" className={`${styles.btn} ${styles.successBtn}`} id={ product._id } onClick={showPanel} name='restockBtn' >Restock</a>
                                    </td>
                                </tr>
                            ))
                        }
                        
                    </tbody>
                </table>
                </div>
                <div>
                <Pagination totalItems={products.length} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                </div>
            </div>
        </div>
    </>
    
  )
}

export default Products
