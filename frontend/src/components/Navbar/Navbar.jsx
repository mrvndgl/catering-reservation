import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = () => {

const [menu,setMenu] = useState ("Menu");

  return (

        <div className="navbar">
            <img className='logo' src={assets.logo} alt="" />
            <ul className='navbar-menu'>
                <Link to='/' onClick={()=>setMenu("Home")} className={menu==="Home"?"active":""}>Home</Link>
                <a href='#explore-menu' onClick={()=>setMenu("Menu")} className={menu==="Menu"?"active":""}>Menu</a>
                <a href='#footer' onClick={()=>setMenu("Contact-us")} className={menu==="Contact-us"?"active":""}>Contact us</a>
            </ul>
            <div className="navbar-right">
          <img src={assets.search_icon} alt="" />
          </div>
        </div>
  )
}

export default Navbar