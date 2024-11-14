import express from "express";
import Reservation from "../models/reservationModel.js";
import {
  sendNotificationToAdmin,
  sendNotificationToCustomer,
} from "../utils/notifications.js"; // Import notification functions

const router = express.Router();

// Create a new reservation
router.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    numberOfPax,
    venue,
    date,
    timeSlot,
    note,
  } = req.body;

  const newReservation = new Reservation({
    firstName,
    lastName,
    phoneNumber,
    numberOfPax,
    venue,
    date,
    timeSlot,
    note,
  });

  try {
    const savedReservation = await newReservation.save();

    // Notify admin of the new reservation
    sendNotificationToAdmin(savedReservation);

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept a reservation
router.post("/:id/accept", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = "accepted";
    await reservation.save();

    // Notify customer of the reservation acceptance
    sendNotificationToCustomer(reservation);

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error accepting reservation", error });
  }
});

export default router;
