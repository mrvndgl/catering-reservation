const Reservation = "../models/reservationModel.js"; // Assuming you have a Reservation model

// Handle new reservation creation
const createReservation = async (req, res) => {
  try {
    // Extract reservation details from request body
    const {
      firstName,
      lastName,
      phoneNumber,
      pax,
      date,
      timeSlot,
      address, // Contains street, city, and province
      note,
    } = req.body;

    // Validate reservation details
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !pax ||
      !date ||
      !timeSlot ||
      !address.street ||
      !address.city ||
      !address.province
    ) {
      return res
        .status(400)
        .json({ error: "All reservation details are required" });
    }

    // Create a new reservation in the database
    const newReservation = await Reservation.create({
      firstName,
      lastName,
      phoneNumber,
      numberOfPax: pax,
      date,
      timeSlot,
      venue: address, // Assumes address contains street, city, and province
      note,
    });

    // Send a success response with a message
    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
};

module.exports = {
  createReservation,
};
