import express from "express";
import {
  createReservation,
  getReservations,
  getReservation,
  updateReservationStatus,
  deleteReservation,
  getReservationStats,
  getReservationByReferenceCode,
} from "../controllers/reservationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createReservation)
  .get(protect, admin, getReservations);

router.route("/stats").get(protect, admin, getReservationStats);

router
  .route("/reference/:referenceCode")
  .get(protect, getReservationByReferenceCode);

router
  .route("/:id")
  .get(protect, getReservation)
  .put(protect, admin, updateReservationStatus)
  .delete(protect, admin, deleteReservation);

export default router;
