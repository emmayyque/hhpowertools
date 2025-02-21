import React, { useEffect, useState } from 'react'
import styles from './Dash.module.css'
import ProfileIcon from '../../assets/images/profile.png'
const baseURL = import.meta.env.VITE_NODE_URL

const Miscellaneous = () => {


    useEffect(() => {
        document.title = "HH Power Tools | Dashboard"
        getRegionFees()
        getWeightFees()
        getSliderBanners()
        getHomeBanners()
        getShopBanner()
    }, [])

    const [ regionFees, setRegionFees ] = useState([])
    const [ regionFee, setRegionFee ] = useState(null)
    const [ weightFees, setWeightFees ] = useState([])
    const [ weightFee, setWeightFee ] = useState(null)
    const [ idFromDb, setIdFromDb ] = useState()
    const [ response, setResponse ] = useState({})

    const getRegionFees = async () => {
        const resp = await fetch(`${baseURL}/api/shippingfee/getall`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await resp.json()

        if (json.success) {
            setRegionFees(json.data)
        } else {
            console.log(json)
        }
    }

    const getRegionFee = async (e) => {
        const id = e.target.value
        if (id != 0) {
            const resp = await fetch(`${baseURL}/api/shippingfee/getone/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setIdFromDb(json.data._id)
                setRegionFee(json.data.fee)
            } else {
                console.log(json)
            }
        } 
    }

    const regionInputHandler = (e) => {
        const { value } = e.target
        setRegionFee(value)
    }

    const editRegionFeeHandler = async (e) => {
        e.preventDefault()
        if (idFromDb != null && regionFee != null) {
            const token = localStorage.getItem("token")
            if (token) {
                const resp = await fetch(`${baseURL}/api/shippingfee/update/${idFromDb}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    },
                    body: JSON.stringify({
                        fee: regionFee
                    })
                })
    
                const json = await resp.json()
    
                if (json.success) {
                    setResponse({
                        message: json.message
                    })
                } else {
                    console.log(json)
                }
    
                setTimeout(() => {
                    setResponse({})
                }, 4000)
            }
        }
    }


    const getWeightFees = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/weightfee/getall`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setWeightFees(json.data)
            } else {
                console.log(json)
            }
        }
    }

    const getWeightFee = async (e) => {
        const id = e.target.value
        const token = localStorage.getItem("token")
        if (id != 0 && token) {
            const resp = await fetch(`${baseURL}/api/weightfee/getone/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
    
            const json = await resp.json()
    
            if (json.success) {
                setIdFromDb(json.data._id)
                setWeightFee(json.data.fee)
            } else {
                console.log(json)
            }
        } 
    }

    const rangeInputHandler = (e) => {
        const { value } = e.target
        setWeightFee(value)
    }

    const editWeightFeeHandler = async (e) => {
        e.preventDefault()
        if (idFromDb != null && weightFee != null) {
            const token = localStorage.getItem("token")
            if (token) {
                const resp = await fetch(`${baseURL}/api/weightfee/update/${idFromDb}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    },
                    body: JSON.stringify({
                        fee: weightFee
                    })
                })
    
                const json = await resp.json()
    
                if (json.success) {
                    setResponse({
                        message: json.message
                    })
                } else {
                    console.log(json)
                }
    
                setTimeout(() => {
                    setResponse({})
                }, 4000)
            }
        }
    }


    // Hero Slider
    const [ sliderImage1, setSliderImage1 ] = useState({})
    const [ sliderImage2, setSliderImage2 ] = useState(null)
    const [ sliderImage3, setSliderImage3 ] = useState(null)

    const getSliderBanners = async () => {
        const resp = await fetch(`${baseURL}/api/banner/getByType/Hero-Banner`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await resp.json()

        if (json.success) {
            if (json.data[0]) {
                setSliderImage1({
                    id: json.data[0]._id,
                    image: `${baseURL}${json.data[0].imageUrl}`
                })
            }
            if (json.data[1]) {
                setSliderImage2({
                    id: json.data[1]._id,
                    image: `${baseURL}${json.data[1].imageUrl}`
                })
            }
            if (json.data[2]) {
                setSliderImage3({
                    id: json.data[2]._id,
                    image: `${baseURL}${json.data[2].imageUrl}`
                })
            }            
        } else {
            console.log(json)
        }
    }

    const handleSliderImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (e.target.name == 'banner1') {
                    setSliderImage1({
                        id: sliderImage1.id,
                        image: event.target.result
                    })
                } else if (e.target.name == 'banner2') {
                    setSliderImage2({
                        id: sliderImage2.id,
                        image: event.target.result
                    })
                } else if (e.target.name == 'banner3') {
                    setSliderImage3({
                        id: sliderImage3.id,
                        image: event.target.result
                    })
                } 
            }
            reader.readAsDataURL(file)          
        } 
    }

    const editSliderBanners = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (token) {
            const fd = new FormData(document.getElementById('sliderBannerForm'))
            const resp = await fetch(`${baseURL}/api/banner/update`, {
                method: "PUT",
                headers: {
                    "auth-token": token
                },
                body: fd,
                credentials: 'include'
            })
    
            const json = await resp.json()
            if (json.success) {
                getSliderBanners()
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

    // Home Banner    
    const [ homeBanner, setHomeBanner ] = useState({})
    const [ homeBannerMob, setHomeBannerMob ] = useState({})
    const getHomeBanners = async () => {
        const resp = await fetch(`${baseURL}/api/banner/getByType/Home-Banner`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await resp.json()

        if (json.success) {
            if (json.data[0]) {
                setHomeBanner({
                    id: json.data[0]._id,
                    image: `${baseURL}${json.data[0].imageUrl}`
                })
            }       

            if (json.data[1]) {
                setHomeBannerMob({
                    id: json.data[1]._id,
                    image: `${baseURL}${json.data[1].imageUrl}`
                })
            }   
        } else {
            console.log(json)
        }
    }

    const handleHomeBanner = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (e.target.name == 'banner1') {
                    setHomeBanner({
                        id: homeBanner.id,
                        image: event.target.result
                    })
                } else if (e.target.name == 'banner2') {
                    setHomeBannerMob({
                        id: homeBannerMob.id,
                        image: event.target.result
                    })
                }
            }
            reader.readAsDataURL(file)          
        } 
    }

    const editHomeBanners = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (token) {
            const fd = new FormData(document.getElementById('homeBannerForm'))
            const resp = await fetch(`${baseURL}/api/banner/update`, {
                method: "PUT",
                headers: {
                    "auth-token": token
                },
                body: fd,
                credentials: 'include'
            })
    
            const json = await resp.json()
            if (json.success) {
                getHomeBanners()
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

    // Shop Banner    
    const [ shopBanner, setShopBanner ] = useState({})
    const getShopBanner = async () => {
        const resp = await fetch(`${baseURL}/api/banner/getByType/Shop-Banner`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await resp.json()

        if (json.success) {
            if (json.data[0]) {
                setShopBanner({
                    id: json.data[0]._id,
                    image: `${baseURL}${json.data[0].imageUrl}`
                })
            }       
        } else {
            console.log(json)
        }
    }

    const handleShopBanner = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (e.target.name == 'banner1') {
                    setShopBanner({
                        id: shopBanner.id,
                        image: event.target.result
                    })
                } 
            }
            reader.readAsDataURL(file)          
        } 
    }

    const editShopBanner = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (token) {
            const fd = new FormData(document.getElementById('shopBannerForm'))
            const resp = await fetch(`${baseURL}/api/banner/update`, {
                method: "PUT",
                headers: {
                    "auth-token": token
                },
                body: fd,
                credentials: 'include'
            })
    
            const json = await resp.json()
            if (json.success) {
                getShopBanner()
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

  return (
    <>
    { response.errors && <div className={styles.alertError}>{response.errors}</div> }
    { response.error && <div className={styles.alertError}>{response.error}</div> }
    { response.message && <div className={styles.alertSuccess}>{response.message}</div> }
    <div className={`${styles.row} ${styles.gap2}`}>
        <div className={`${styles.dPanel}`}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Region Costs</h2>
            </div>
            <div className={`${styles.dPanelBody}`}>
                <form action="" className={`${styles.column} ${styles.gap1} ${styles.alignEnd}`}>
                    <div className={`${styles.formField} form-field`}>
                        <label htmlFor="">Shipping Region</label>
                        <select name="region" id="region" onChange={getRegionFee} defaultValue={0}>
                            <option value="0" disabled >Select Region</option>
                            {
                                regionFees && regionFees.map((region, index) => (
                                    <option value={`${region._id}`} key={index} >{region.region}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={`${styles.formField} form-field`}>
                        <label htmlFor="fee">Fee/Cost</label>
                        <input type="number" name='fee' value={regionFee} onChange={regionInputHandler} />
                    </div>
                    
                    <div className={`${styles.column} ${styles.actions}`}>
                        <button className={styles.btn2} onClick={editRegionFeeHandler}>Update Fee</button>
                    </div>
                </form>
            </div>
        </div>
        <div className={`${styles.dPanel}`}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Weight Costs</h2>
            </div>
            <div className={`${styles.dPanelBody}`}>
                <form action="" className={`${styles.column} ${styles.gap1} ${styles.alignEnd}`}>
                    <div className={`${styles.formField} form-field`}>
                        <label htmlFor="">Weight Range</label>
                        <select name="range" id="range" onChange={getWeightFee} defaultValue={0}>
                            <option value="0" disabled >Select Range</option>
                            {
                                weightFees && weightFees.map((item, index) => (
                                    <option value={`${item._id}`} key={index} >{item.range}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={`${styles.formField} form-field`}>
                        <label htmlFor="fee">Fee/Cost</label>
                        <input type="number" name='fee' value={weightFee} onChange={rangeInputHandler} />
                    </div>
                    
                    <div className={`${styles.column} ${styles.actions}`}>
                        <button className={styles.btn2} onClick={editWeightFeeHandler}>Update Fee</button>
                    </div>
                </form>
            </div>
        </div>
        <div className={`${styles.dPanel}`}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Home Slider</h2>
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <form action="" encType='multipart/form-data' id='sliderBannerForm' className={`${styles.column} ${styles.gap1} ${styles.alignEnd}`}>
                    <div className={styles.formField}>
                        <label htmlFor="image">Home Slider Images</label>
                        <div className={`${styles.row} ${styles.gap1} ${styles.flexWrap}`}>
                            { sliderImage1 && <input type="hidden" name="banner1Id" id="banner1Id" value={sliderImage1.id}/> }
                            <div className={styles.fileUpload}>
                                { sliderImage1 && <img src={sliderImage1.image} alt="" />}
                                <input type="file" className={styles.upload} name='banner1' id='banner1' onChange={handleSliderImage}/>
                                <span>+</span>
                            </div>
                            { sliderImage2 && <input type="hidden" name="banner2Id" id="banner2Id" value={sliderImage2.id}/>}
                            <div className={styles.fileUpload}>
                                { sliderImage2 && <img src={sliderImage2.image} alt="" />}
                                <input type="file" className={styles.upload} name='banner2' id='banner2' onChange={handleSliderImage}/>
                                <span>+</span>
                            </div>
                            { sliderImage3 && <input type="hidden" name="banner3Id" id="banner3Id" value={sliderImage3.id}/> }
                            <div className={styles.fileUpload}>
                                { sliderImage3 && <img src={sliderImage3.image} alt="" />}
                                <input type="file" className={styles.upload} name='banner3' id='banner3' onChange={handleSliderImage}/>
                                <span>+</span>
                            </div>    
                        </div>
                    </div>                
                    <div className={`${styles.column} ${styles.actions}`}>
                        <button className={styles.btn2} onClick={editSliderBanners}>Update Banners</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div className={`${styles.row} ${styles.gap2}`}>
        <div className={`${styles.dPanel}`}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Home Banner</h2>
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <form action="" encType='multipart/form-data' id="homeBannerForm" className={`${styles.column} ${styles.gap1} ${styles.alignEnd}`}>
                    <div className={styles.formField}>
                        <label htmlFor="image">Home Banner Image</label>
                        <div className={`${styles.row} ${styles.gap1} ${styles.flexWrap}`}>
                            { homeBanner && <input type="hidden" name="banner1Id" id="banner1Id" value={homeBanner.id}/> }
                            <div className={styles.fileUpload}>
                                { homeBanner && <img src={homeBanner.image} alt="" />}
                                <input type="file" className={styles.upload} name='banner1' id='banner1' onChange={handleHomeBanner}/>
                                <span>+</span>
                            </div> 
                            { homeBannerMob && <input type="hidden" name="banner2Id" id="banner2Id" value={homeBannerMob.id}/> }
                            <div className={styles.fileUpload}>
                                { homeBannerMob && <img src={homeBannerMob.image} alt="" />}
                                <input type="file" className={styles.upload} name='banner2' id='banner2' onChange={handleHomeBanner}/>
                                <span>+</span>
                            </div> 
                        </div>
                    </div>       
                    
                    <div className={`${styles.column} ${styles.actions}`}>
                        <button className={styles.btn2} onClick={editHomeBanners}>Update Banners</button>
                    </div>
                </form>
            </div>
        </div>
        <div className={`${styles.dPanel}`}>
            <div className={`${styles.row} ${styles.dActions}`}>
                <h2 className={styles.dPanelHeading}>Shop Banner</h2>
            </div>
            <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
                <form action="" encType='multipart/form-data' id="shopBannerForm" className={`${styles.column} ${styles.gap1} ${styles.alignEnd}`}>
                    <div className={styles.formField}>
                        <label htmlFor="image">Shop Banner Image</label>
                        { shopBanner && <input type="hidden" name="banner1Id" id="banner1Id" value={shopBanner.id}/> }
                        <div className={`${styles.row} ${styles.gap1} ${styles.flexWrap}`}>
                            <div className={styles.fileUpload}>
                                { shopBanner && <img src={shopBanner.image} alt="" />}
                                <input type="file" className={styles.upload} name='banner1' id='banner1' onChange={handleShopBanner}/>
                                <span>+</span>
                            </div> 
                        </div>
                    </div>       
                    
                    <div className={`${styles.column} ${styles.actions}`}>
                        <button className={styles.btn2} onClick={editShopBanner}>Update Banner</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
  )
}

export default Miscellaneous
