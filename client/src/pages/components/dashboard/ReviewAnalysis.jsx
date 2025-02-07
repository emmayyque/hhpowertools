import React from 'react'
import styles from '../../Admin/Dash.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const baseURL = import.meta.env.VITE_NODE_URL

const calculateReviewSentiments = (reviews) => {
    const totalReviews = reviews.length

    if (totalReviews === 0)  {
        return { positive: 0, neutral: 0, negative: 0 }
    }

    const sentimentCounts = {
        positive: 0,
        neutral: 0,
        negative: 0
    }

    reviews.forEach((review) => {
        if (review.rating >= 4) {
            sentimentCounts.positive++
        } else if (review.rating == 3) {
            sentimentCounts.neutral++
        } else if (review.rating <= 2) {
            sentimentCounts.negative++
        }
    })

    return {
        positive: ((sentimentCounts.positive / totalReviews) * 100).toFixed(2),
        neutral: ((sentimentCounts.neutral / totalReviews) * 100).toFixed(2),
        negative: ((sentimentCounts.negative / totalReviews) * 100).toFixed(2)
    }
}

const Counter = (maxCount) => {
    const [count, setCount] = useState(0);
  
    useEffect(() => {
        const interval = setInterval(() => {
        setCount((prevCount) => {
            if (prevCount < maxCount) {
            return prevCount + 1;
            } else {
            clearInterval(interval);
            return prevCount;
            }
        });
        }, 25); // Adjust speed by changing interval time

        return () => clearInterval(interval); // Cleanup on unmount
    }, [maxCount]);

    return count.toFixed(2);
};

const ReviewAnalysis = () => {
    const [ reviews, setReviews ] = useState([])
    const [ sentiments, setSentiments ] = useState({ positive: 0, neutral: 0, negative: 0 })

    useEffect(() => {
        getReviews()
    }, [])

    const getReviews = async () => {
        const resp = await fetch(`${baseURL}/api/review/getall`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": `${import.meta.env.VITE_AUTH_TOKEN}`
            }
        })

        const json = await resp.json()
        if (json.success) {
            setReviews(json.data)
            setSentiments(calculateReviewSentiments(json.data))
        } else {
            console.log(json)
        }
    }

    let negCount = 0
    let posCount = 0
    let neuCount = 0

    useEffect(() => {
        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].rating >= 4) {
                posCount = posCount + 1
            }            

            if (reviews[i].rating == 3) {
                neuCount = neuCount + 1
            }

            if (reviews[i].rating <= 2) {
                negCount = negCount + 1
            }
        }
    }, [reviews.length])

    const [ negValue, setNegValue ] = useState(negCount)
    const [ posValue, setPosValue ] = useState(posCount)
    const [ neuValue, setNeuValue ] = useState(neuCount)
  return (
    <div className={`${styles.reviewAnalysis} ${styles.dPanel}`}>
        <h2 className={styles.dPanelHeading}>Reviews</h2>
        <div className={`${styles.dPanelBody} ${styles.column} ${styles.gap3}`}>
            <div className={styles.column}>
                <div className={styles.row}>
                    <p>Positive Reviews</p>
                    <span>{ sentiments.positive }%</span>
                </div>
                <div className={styles.track}>
                    <div className={styles.trackFill} style={{ width: `${sentiments.positive}%` }}></div>
                </div>
            </div>
            <div className={styles.column}>
                <div className={styles.row}>
                    <p>Neutral Reviews</p>
                    <span>{ sentiments.neutral }%</span>
                </div>
                <div className={styles.track}>
                    <div className={styles.trackFill} style={{ width: `${sentiments.neutral}%` }}></div>
                </div>
            </div>
            <div className={styles.column}>
                <div className={styles.row}>
                    <p>Negative Reviews</p>
                    <span>{ sentiments.negative }%</span>
                </div>
                <div className={styles.track}>
                    <div className={styles.trackFill} style={{ width: `${sentiments.negative}%` }}></div>
                </div>
            </div>
            <div className={`${styles.column} ${styles.actions}`}>
                <Link to="/Admin/Dashboard/Reviews" className={styles.btn2}>View All Reviews</Link>
            </div>
        </div>
    </div>
  )
}

export default ReviewAnalysis
