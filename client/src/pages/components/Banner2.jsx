import React, { useEffect, useState } from 'react'
import Banner from '../../assets/images/banners/banner2.jpg'
const baseURL = import.meta.env.VITE_NODE_URL

const Banner2 = () => {
  const [ shopBanner, setShopBanner ] = useState([])

  useEffect(() => {
    getShopBanner()
  }, [])

  const getShopBanner = async () => {
    const resp = await fetch(`${baseURL}/api/banner/getByType/Shop-Banner`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })

    const json = await resp.json()

    if (json.success) {
      setShopBanner(json.data)
    } else {
      console.log(json.error)
    }
  }

  return (
    <div className='banner-2'>
      { 
        shopBanner.length === 0 ? '' :
        <img src={baseURL + shopBanner[0].imageUrl} alt="" />
      }
    </div>
  )
}

export default Banner2
