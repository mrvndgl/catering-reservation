import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

export const ExploreMenu = ({category,setCategory}) => {
  
    return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>At Macky's Food Service, explore our diverse menu crafted to delight your taste buds! From exquisite appetizers to sumptuous main courses and delectable desserts, our catering options cater to every palate. Discover the perfect dishes for your event with our easy-to-navigate menu.</p>
        <div className="explore-menu-list">
            {menu_list.map((item,index)=>{
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}
