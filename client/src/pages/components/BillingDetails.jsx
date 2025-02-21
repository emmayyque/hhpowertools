import React, { useContext, useEffect, useState } from 'react'
import CartContext from '../../context/cart/CartContext'
const baseURL = import.meta.env.VITE_NODE_URL

const BillingDetails = ({ billing }) => {
  const [ isLoading, setIsLoading ] = useState(true)
  
  const [ states, setStates ] = useState([])
  const data = useContext(CartContext)

  useEffect(() => {
    getShippingCost()
  }, [])

  const getShippingCost = async () => {
    const resp = await fetch(`${baseURL}/api/shippingfee/getall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const json = await resp.json()

    if (json.success) {
      setStates(json.data)
    } else {
      console.log(json.error)
    }
  }


  setTimeout(() => {
    setIsLoading(false)
  }, 50);


  const inputHandler = (e) => {
    const { name, value } = e.target
    billing.setFormValues({ ...billing.formValues, [name]: value })
  }

  return (
    isLoading ? '' :
    <div className='billing-details' >
      <form action="" className='row gap1'>
        <div className='column gap1'>
          <div className="form-group gap1">
            <div className="form-field">
              <label htmlFor="firstName">First Name</label>
              <input type="text" name='firstName' id='firstName' value={ billing.formValues.firstName } onChange={ inputHandler } />
              { billing.formErrors.firstName && <span className='form-field-error'>{ billing.formErrors.firstName }</span> }
            </div>
            <div className="form-field">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" name='lastName' id='lastName' value={ billing.formValues.lastName } onChange={ inputHandler } />
              { billing.formErrors.lastName && <span className='form-field-error'>{ billing.formErrors.lastName }</span> }
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' value={ billing.formValues.email } onChange={ inputHandler } />
            { billing.formErrors.email && <span className='form-field-error'>{ billing.formErrors.email }</span> }
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone No</label>
            <input type="text" name='phone' id='phone' value={ billing.formValues.phone } onChange={ inputHandler } />
            { billing.formErrors.phone && <span className='form-field-error'>{ billing.formErrors.phone }</span> }
          </div>    
        </div>
        <div className='column gap1'>
          <div className="form-field">
            <label htmlFor="street">Street Address</label>
            <input type="text" name='street' id='street' value={ billing.formValues.street } onChange={ inputHandler } />
            { billing.formErrors.street && <span className='form-field-error'>{ billing.formErrors.street }</span> }
          </div>
          <div className="form-group gap1">
            <div className="form-field">
              <label htmlFor="area">Area</label>
              <input type="text" name='area' id='area' value={ billing.formValues.area } onChange={ inputHandler } />
              { billing.formErrors.area && <span className='form-field-error'>{ billing.formErrors.area }</span> }
            </div>
            <div className="form-field">
              <label htmlFor="city">Town/City</label>
              <input type="text" name='city' id='city' value={ billing.formValues.city } onChange={ inputHandler } />
              { billing.formErrors.city && <span className='form-field-error'>{ billing.formErrors.city }</span> }
            </div>
          </div>
          <div className="form-group gap1">
            <div className="form-field">
              <label htmlFor="state">State</label>
              <select name="state" id="state" value={ billing.formValues.state } onChange={ inputHandler }>
                <option value="0" disabled>Select State</option>
                {
                  states && states.map((item, index) => (
                    <option value={item.region} key={index}>{ item.region }</option>
                  ))
                }
              </select>
              { billing.formErrors.state && <span className='form-field-error'>{ billing.formErrors.state }</span> }
            </div>
            <div className="form-field">
              <label htmlFor="zipCode">Zip Code</label>
              <input type="number" name='zipCode' id='zipCode' />
              { billing.formErrors.zipCode && <span className='form-field-error'>{ billing.formErrors.zipCode }</span> }
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BillingDetails
