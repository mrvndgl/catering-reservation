import Reservation from "../models/reservationModel.js";

// Utility function to generate unique reference code
const generateUniqueReferenceCode = async () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referenceCode;
  let isUnique = false;

  while (!isUnique) {
    referenceCode = Array(8)
      .fill()
      .map(() =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      )
      .join("");

    // Check if the reference code already exists
    const existingReservation = await Reservation.findOne({ referenceCode });
    if (!existingReservation) {
      isUnique = true;
    }
  }

  return referenceCode;
};

// Create new reservation
export const createReservation = async (req, res) => {
  try {
    // Generate unique reference code if not provided
    const referenceCode =
      req.body.referenceCode || (await generateUniqueReferenceCode());

    // Create reservation with reference code
    const reservation = new Reservation({
      ...req.body,
      referenceCode,
    });

    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reservations
export const getReservations = async (req, res) => {
  try {
    const { status, date, timeSlot } = req.query;
    let query = {};

    if (status) query.status = status;
    if (date) query.date = new Date(date);
    if (timeSlot) query.timeSlot = timeSlot;

    const reservations = await Reservation.find(query).sort({ date: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single reservation
export const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reservation by reference code
export const getReservationByReferenceCode = async (req, res) => {
  try {
    const { referenceCode } = req.params;
    const reservation = await Reservation.findOne({
      referenceCode: referenceCode.toUpperCase(),
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update reservation status
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete reservation
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reservations statistics
export const getReservationStats = async (req, res) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$subtotal" },
        },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
