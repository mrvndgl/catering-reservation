// notificationController.js
import Notification from "../models/notificationModel.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const newNotification = new Notification({
      userId: req.body.userId,
      message: req.body.message,
      type: req.body.type,
      actionLink: req.body.actionLink,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
