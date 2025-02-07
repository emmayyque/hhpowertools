import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import * as Icons from 'react-icons/fa6'
import ProductContext from '../../context/products/ProductContext'
const baseURL = import.meta.env.VITE_NODE_URL

const Reviews = (props) => {
  const totalStars = 5
  let total = 0
  let avg = 0
  const [ isLoading, setIsLoading ] = useState([])
  const [ reviews, setReviews ] = useState([])

  useEffect(() => {
    getReviews(props.productId)
  }, [])

  const getReviews = async (product) => {
    const resp = await fetch(`${baseURL}/api/review/getbyproduct/${product}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const json = await resp.json()

    if (json.success) {
      setReviews(json.data)
    } else {
      console.log(json.error)
    }
  }
  
  setTimeout(() => {
    setIsLoading(false)
  }, 50);

  if (!isLoading) {
    if (reviews.length > 0) {
      for (var i in reviews) {
        total += reviews[i].rating
      }
      avg = total / reviews.length
    }  
  }

  const timeAgo = (date) => {
      const now = new Date();
      const past = new Date(date);
      const seconds = Math.floor((now - past) / 1000);

      const intervals = {
          year: 31536000,
          month: 2592000,
          week: 604800,
          day: 86400,
          hour: 3600,
          minute: 60,
          second: 1
      };

      for (let unit in intervals) {
          const value = Math.floor(seconds / intervals[unit]);
          if (value >= 1) {
              return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
          }
      }
      return "just now";
  }

  return (
      <div className='reviews column'>
          <div>
            <p>Based on {reviews.length} Reviews</p>
            <div className='row gap1'>
              <h2>{ avg ? avg : 0}.0</h2>
              <span>overall</span>
            </div>
          </div>
          <div>
            {
              reviews && reviews.map((review, index) => (
                <div className="review-item" key={index}>
                  <div className="row">
                    <h2>{ review.name } <span>- { timeAgo(review.createdAt) }</span></h2>
                    <h3>
                      { review.rating }.0
                      
                      <span className='star'>
                        {[...Array(totalStars)].map((_, index) =>
                          index < review.rating ? <Icons.FaStar key={index} /> : <Icons.FaRegStar key={index} />
                        )}
                      </span>
                    </h3>
                  </div>
                  <p>
                    { review.review }
                  </p>
                </div>
              ))
            }
          </div>
      </div>      
  )
}

export default Reviews
