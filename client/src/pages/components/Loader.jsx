import React from 'react'
import Logo from '../../assets/images/HHPT.png'

const Loader = () => {

  return (
    <div className='loader column'>
        <img src={Logo} alt="" className='loader-logo'/>
        <p>Loading..</p>
    </div>
  )
}

export default Loader
