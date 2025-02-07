import React from 'react'
import Logo from '../../assets/images/logo3.png'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Loader = () => {
    let timeline = gsap.timeline()
    // useGSAP(() => {
    //     gsap.to(".loader", {
    //         opacity: 0,
    //         delay: 1,
    //         duration: 0.5,
    //         "transform": "translateY(-100%)"
    //     })
    // })
    
    useGSAP(() => {
        timeline.to(".loader-logo", {
            opacity: 0,
            delay: 0.5,
            duration: 1,
            scale: 1.3
        })

        timeline.to(".loader", {
            opacity: 0,
            scale: 0.5,
            delay: 1,
            duration: 0.5,
            "transform": "translateY(-100%)"
        })
    })

  return (
    <div className='loader row'>
        <img src={Logo} alt="" className='loader-logo'/>
    </div>
  )
}

export default Loader
