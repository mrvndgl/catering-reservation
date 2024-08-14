import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './PlaceOrder.css'
import { useLocation } from 'react-router-dom'
import { food_list } from '../../assets/assets' 

const PlaceOrder = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [selectedPax, setSelectedPax] = useState('')
  const [subtotal, setSubtotal] = useState(0)
  const [formErrors, setFormErrors] = useState({})
  const location = useLocation()
  const { totalPrice, selectedItems } = location.state

  useEffect(() => {
    setSubtotal(totalPrice)
  }, [totalPrice])

  const calculateSubtotal = () => {
    let total = 0
    Object.entries(selectedItems).forEach(([category, items]) => {
      items.forEach((isSelected, index) => {
        if (isSelected) {
          const item = food_list.find(food => food.category === category && food.name === food_list[index].name)
          if (item) {
            total += item.price
          }
        }
      })
    })
    setSubtotal(total)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = {}

    if (!selectedDate) {
      errors.selectedDate = 'Date is required'
    }
    if (!selectedTimeSlot) {
      errors.selectedTimeSlot = 'Time slot is required'
    }
    if (!selectedPax) {
      errors.selectedPax = 'Number of pax is required'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
    } else {
      setFormErrors({})
      // Proceed to payment
    }
  }

  const timeSlots = [
    { label: 'Lunch (11:00 AM - 12:00 PM)', value: 'lunch' },
    { label: 'Early Dinner (4:00 PM - 5:00 PM)', value: 'early-dinner' },
    { label: 'Dinner (5:00 PM - 7:00 PM)', value: 'dinner' }
  ]

  const paxOptions = [
    '50-60', '60-70', '70-80', '80-90', '90-100',
    '100-110', '110-120', '120-130', '130-140', '140-150'
  ]

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className='title'>Reservation Information</p>
        <div className="multi-fields">
          <input type="text" placeholder='First Name' required/>
          <input type="text" placeholder='Last Name' required/>
        </div>
        <input type="text" placeholder='Phone no.' required/>
        <select 
          value={selectedPax} 
          onChange={(e) => setSelectedPax(e.target.value)}
          className="pax-select"
          required
        >
          <option value="">No. of pax</option>
          {paxOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {formErrors.selectedPax && <span style={{ color: 'red' }}>{formErrors.selectedPax}</span>}
        <div className="select-date">
          <div className='place-order-center'>
          <p className='title-venue'>Venue</p>
          <div className="multi-fields">
            <input type="text" placeholder='Street' required/>
            <input type="text" placeholder='City' required/>
            <input type="text" placeholder='Province' required/>
          </div>
        </div>
        <p className='title-date'>Select Date</p>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          className='date-select'
          placeholderText="Click to select a date"
          dateFormat="MMMM d, yyyy"
          required
        />
        {formErrors.selectedDate && <span style={{ color: 'red' }}>{formErrors.selectedDate}</span>}
        <p className='title-time'>Select Time Slot</p>
        <select 
          value={selectedTimeSlot} 
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
          className="time-slot-select"
          required
        >
          <option value="">Select a time slot</option>
          {timeSlots.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>
        {formErrors.selectedTimeSlot && <span style={{ color: 'red' }}>{formErrors.selectedTimeSlot}</span>}
      </div>
      </div>
      <div className="place-order-right">
        <div className="order-total">
          <p className='title'>Order Total</p>
          <div>
            <div className="order-total-details">
              <p>Subtotal</p>
              <p>PHP {subtotal.toFixed(2)}</p>
            </div>
            <div>
              <button type="submit">PROCEED TO PAYMENT</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
