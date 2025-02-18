import React, { useEffect, useState } from 'react'

const baseURL = import.meta.env.VITE_NODE_URL

const HeroBanner = () => {
  const [ isLoading, setIsLoading ] = useState(true)
  const [ banners, setBanners ] = useState([])

  useEffect(() => {
    getBanners()
  }, [])

  const getBanners = async () => {
    const resp = await fetch(`${baseURL}/api/banner/getByType/Hero-Banner`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const json = await resp.json()
    if (json.success) {
      setBanners(json.data)
    } else {
      console.log(json.error)
    }
  }
    
    setTimeout(() => {
      setIsLoading(false)
    }, 1500);

    const [ currentIndex, setCurrentIndex ] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // 3 seconds interval for sliding
  
      return () => clearInterval(interval); // Clear the interval on component unmount
    }, [banners.length]);

  return (    
    <div className='hero-banner row'>      
      {
        banners.length === 0 ? (
        ''
      ) : (
        banners.map((banner, index) => (
          <div className='hero-banner-slide' key={index} style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: "transform 1s ease-in-out" }}>
            <img src={`${baseURL}${banner.imageUrl}`} alt="Uploaded" width="200px" />
          </div>          
        ))
      )}
    </div>
  )
}

export default HeroBanner