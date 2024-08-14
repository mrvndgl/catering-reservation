import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import { ExploreMenu } from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import Reservation from '../../components/Reservation/Reservation' 

const Home = () => {
  const [showReservation, setShowReservation] = useState(false)
  const [category, setCategory] = useState("All")

  return (
    <div className="home">
      <Header setShowReservation={setShowReservation} />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      {showReservation && (
        <div className="reservation-overlay">
          <Reservation setShowReservation={setShowReservation}/>
        </div>
      )}
    </div>
  )
}

export default Home