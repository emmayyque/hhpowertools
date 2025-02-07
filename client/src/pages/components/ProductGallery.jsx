import React, { useContext, useState } from 'react'
import * as Icons from 'react-icons/fa6'
import ProductContext from '../../context/products/ProductContext'

const baseURL = import.meta.env.VITE_NODE_URL

const ProductGallery = (props) => {  
  const [ currentIndex, setCurrentIndex ] = useState(0)

  const prevClickHandler = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? props.product.images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const nextClickHandler = () => {
    const isLastSlide = currentIndex === props.product.images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const indicatorClickHandler = (slideIndex) => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div className='product-gallery row'>
      {
        props.product.discount > 0 ? 
        <div className="discount row">
          <h2>{ props.product.discount }</h2>
          <div className="column">
              <span>%</span>
              <span>Off</span>
          </div>
        </div> : ''
      }
      <img src={`${baseURL}${props.product.images[currentIndex].imageUrl}`} alt="Product Image" />
      <Icons.FaChevronLeft className='prev icon' onClick={prevClickHandler}/>
      <Icons.FaChevronRight className='next icon' onClick={nextClickHandler}/>
      <div className='indicators row gap1'>
        {
          props.product.images.map((image, slideIndex) => (
            <div className={`indicator ${ currentIndex === slideIndex ? 'active' : '' }`} key={slideIndex} onClick={() => indicatorClickHandler(slideIndex)}>
              <img src={`${baseURL}${image.imageUrl}`} alt="" />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ProductGallery
