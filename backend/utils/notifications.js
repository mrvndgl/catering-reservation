export const sendNotificationToAdmin = (reservation) => {
  // Logic to send notification to admin
  console.log(`Admin Notification: A new reservation has been created!`);
  console.log(`Details: 
      Name: ${reservation.firstName} ${reservation.lastName}, 
      Phone: ${reservation.phoneNumber}, 
      Pax: ${reservation.numberOfPax}, 
      Venue: ${reservation.venue}, 
      Date: ${reservation.date}, 
      Time: ${reservation.timeSlot}, 
      Note: ${reservation.note}`);
  // Additional logic can be implemented for sending emails or alerts
};

// Function to send notification to the customer about reservation acceptance
export const sendNotificationToCustomer = (reservation) => {
  // Logic to send notification to customer
  console.log(`Customer Notification: Your reservation has been accepted!`);
  console.log(`Details: 
      Name: ${reservation.firstName} ${reservation.lastName}, 
      Venue: ${reservation.venue}, 
      Date: ${reservation.date}, 
      Time: ${reservation.timeSlot}`);
  // Additional logic can be implemented for sending emails or alerts
};
