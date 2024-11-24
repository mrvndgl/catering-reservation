import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  pax: {
    type: Number,
    required: true,
    min: 50,
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      default: "Bohol",
    },
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ["lunch", "early-dinner", "dinner"],
  },
  note: {
    type: String,
    trim: true,
  },
  selectedItems: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  referenceCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 8,
    maxlength: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Reservation", reservationSchema);
