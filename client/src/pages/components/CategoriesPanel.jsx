import React, { useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CategoryContext from '../../context/categories/CategoryContext'
import { ScrollTrigger } from 'gsap/all'
import { Link } from 'react-router-dom'

const baseURL = import.meta.env.VITE_NODE_URL

const CategoriesPanel = () => {
    const catData = useContext(CategoryContext)
    
    gsap.registerPlugin(ScrollTrigger)

    // useGSAP(() => {
    //     gsap.from(".categories-panel .category", {
    //         y: 100,
    //         opacity: 0,
    //         duration: 2,
    //         stagger: 2,
    //         scrollTrigger: {
    //             trigger: ".categories-panel .category",
    //             scroller: "body",
    //             // markers: true,
    //             start: "top 80%",
    //             end: "top 60%",
    //             scrub: 2,
    //         }
    //     })
    // })

  return (
    <div className='categories-panel row gap 3'>
        {
            catData.categories && catData.categories.map((category, index) => (
                <Link to={`/shop/${category.name.split(' ').join('-').toLowerCase()}`} key={index}>
                    <div className="category column gap1" >
                        <div className="cat-image">
                            <img src={ `${baseURL}${category.imageUrl}` } alt="" />
                        </div>
                        <span>{ category.name }</span>
                    </div>  
                </Link>
            ))
        }   
    </div>
  )
}

export default CategoriesPanel
