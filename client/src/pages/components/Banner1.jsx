import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const baseURL = import.meta.env.VITE_NODE_URL

const Banner1 = () => {

  const [ banner, setBanner ] = useState([])

  const getBanner = async () => {
    const resp = await fetch(`${baseURL}/api/banner/getByType/Home-Banner`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const json = await resp.json()

    if (json.success) {
      setBanner(json.data)
    } else {
      console.log(json.error)
    }
  }

  useEffect(() => {
    getBanner()
  }, [])

  return (
    <Link to="./Shop">
      <div className='banner-1'>
          {
            banner.length === 0 ? '' :
            <>
              <img src={baseURL+banner[0].imageUrl} alt="tools service banner" className='banner-1-desktop'/>
              <img src={baseURL+banner[1].imageUrl} alt="tools service banner" className='banner-1-mob'/> 
            </>
          }
      </div>
    </Link>
  )
}

export default Banner1
