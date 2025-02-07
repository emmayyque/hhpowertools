import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import ProductContext from '../../context/products/ProductContext'
const baseURL = import.meta.env.VITE_JSON_SERVER_URL

const Specifications = (props) => {
  
  return (
    <div className='specifications'>
      <table>
        <tbody>
          {
            props.specifications.length === 0 ? 
            <tr>
              <td>No Specifications listed</td>
            </tr> : 
            props.specifications.map((specification, index) => (
              <tr key={index}>
                <td>{ specification.name }</td>
                <td>{ specification.value }</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Specifications
