import React from 'react'
import './Header.css'

const Header = ({setShowReservation}) => {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Create your reservations today.</h2>
            <p>At Macky's Food Service, we offer exceptional catering for any event. Our expert chefs create customized menus with the finest ingredients, and our professional staff ensures seamless service. Reserve today for a perfect blend of taste and elegance.</p>
            <button onClick={()=>setShowReservation(true)} className='create-reservation-btn'>Create Reservation</button>
        </div>
    </div>
  )
}

export default Header