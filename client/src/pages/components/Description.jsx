import React from 'react'
import { useContext } from 'react'
import ProductContext from '../../context/products/ProductContext'

const baseURL = import.meta.env.VITE_NODE_URL

const Description = (props) => {

  return (
    <div className='description'>
      <h2>{ props.product.name }</h2>
      <p><pre>{ props.product.description }</pre></p>
      {
        props.product.features && 
        <>
          <h3>Features:</h3>
          <p><pre>{ props.product.features }</pre></p>
        </>
      }
      {
        props.product.applications && 
        <>
          <h3>Applications:</h3>
          <p><pre>{ props.product.applications }</pre></p>
        </>
      }
      <div className="product-images row">
        {
          props.product.images && props.product.images.map((image, index) => (
            <div className="product-image" key={index}>
              <img src={baseURL+image.imageUrl} alt="" />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Description
