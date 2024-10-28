import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log("Registering user:", { username, email, role });

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password,
      role,
    });
    await newUser.save();

    console.log("User registered successfully:", newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  console.log("Login attempt received");
  try {
    const { username, password } = req.body;
    console.log("Login credentials:", { username });

    const user = await User.findOne({ username });

    console.log("User found in database:", user ? "Yes" : "No");

    if (!user) {
      console.log("No user found, returning invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Comparing passwords");
    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password does not match, returning invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful, generating token");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Sending successful response");
    res.json({
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstName", "lastName", "phoneNumber", "email"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ message: "Invalid updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if a staff user already exists
    let staffUser = await User.findOne({ role: "staff" });

    if (staffUser) {
      // If staff exists, update their information
      staffUser.username = username;
      staffUser.email = email;
      staffUser.password = password;
      staffUser.name = name;
      await staffUser.save();
      return res.json({ message: "Staff account updated", user: staffUser });
    } else {
      // If no staff exists, create a new one
      staffUser = new User({ username, email, password, role: "staff", name });
      await staffUser.save();
      return res
        .status(201)
        .json({ message: "Staff account created", user: staffUser });
    }
  } catch (error) {
    console.error("Error in createStaff:", error);
    return res
      .status(500)
      .json({ message: "Error creating staff account", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters
    const user = await User.findByIdAndDelete(userId); // Delete the user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

export const updateStaffInfo = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedStaff = await User.findOneAndUpdate(
      { _id: req.user._id, role: "staff" },
      { name, email },
      { new: true }
    );
    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff account not found" });
    }
    res.json({ message: "Staff information updated", user: updatedStaff });
  } catch (error) {
    res.status(500).json({
      message: "Error updating staff information",
      error: error.message,
    });
  }
};
