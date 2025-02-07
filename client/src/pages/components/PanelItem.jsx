import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const baseURL = import.meta.env.VITE_NODE_URL

const PanelItem = (props) => {
    const navigate = useNavigate()
    
    const getFormat = (value) => {
        return (
            (value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        )
    }

    const getDiscountedPrice = () => {
        let discVal = (props.costPrice * props.discount) / 100
        return (
            props.costPrice - discVal
        )
    }

    const productViewHandler = (e) => {
        e.preventDefault()
        navigate(`/shop/product/${props.name.split(" ").join("-")}`)   
    }

  return (
    <div className="panel-item row gap1" name={`${props.name}`} id={`${props.id}`} onClick={productViewHandler}>
        <div className="panel-item-image">
            <img src={ baseURL+props.image } alt="" />
        </div>
        <div className="panel-item-body">
            <h3>{ props.name }</h3>
            {
                props.discount > 0 ?
                <>
                    <p className='cut-price'>Rs. { getFormat(props.costPrice) }</p>
                    <p className='actual-price'>Rs. { getFormat(getDiscountedPrice()) }</p>
                </> :
                <p className='actual-price'>Rs. { getFormat(props.costPrice) }</p>
            }
        </div>
    </div>
  )
}

export default PanelItem
