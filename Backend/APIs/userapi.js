import exp from "express";
import { UserModel } from "../Models/UserModel.js";

const userAPI = exp.Router();

// Helper function to normalize date to YYYY-MM-DD format (MongoDB compliant)
const normalizeDate = (dateStr) => {
  if (dateStr && typeof dateStr === "string") {
    const parts = dateStr.split("-");
    // If format is DD-MM-YYYY or MM-DD-YYYY (e.g. year is at the end)
    if (parts.length === 3 && parts[2].length === 4) {
      const dayOrMonth1 = parts[0];
      const dayOrMonth2 = parts[1];
      const year = parts[2];
      return `${year}-${dayOrMonth2.padStart(2, "0")}-${dayOrMonth1.padStart(2, "0")}`;
    }
  }
  return dateStr;
};

// CREATE USER
userAPI.post("/users", async (req, res, next) => {
  try {
    console.log("POST /users - Request Body received:", req.body);

    // Normalize dateOfBirth if present in DD-MM-YYYY format
    if (req.body.dateOfBirth) {
      req.body.dateOfBirth = normalizeDate(req.body.dateOfBirth);
      console.log("POST /users - Normalized dateOfBirth:", req.body.dateOfBirth);
    }

    let newUser = req.body;
    let newUserDoc = new UserModel(newUser);
    await newUserDoc.save();

    console.log("POST /users - User successfully created:", newUserDoc);
    res.status(201).json({ message: "user created", payload: newUserDoc });
  } catch (error) {
    console.log("POST /users - Error occurred:", error);
    // Let global error handler process standard mongoose error responses
    next(error);
  }
});

// READ ALL USERS
userAPI.get("/users", async (req, res, next) => {
  try {
    let userList = await UserModel.find();
    res.status(200).json({ message: "users", payload: userList });
  } catch (error) {
    console.log("GET /users - Error occurred:", error);
    next(error);
  }
});

// READ USER BY ID
userAPI.get("/users/:id", async (req, res, next) => {
  try {
    let uid = req.params.id;
    let user = await UserModel.findById(uid);
    res.status(200).json({ message: "user found", payload: user });
  } catch (error) {
    console.log("GET /users/:id - Error occurred:", error);
    next(error);
  }
});

// DELETE USER BY ID
userAPI.delete("/users/:id", async (req, res, next) => {
  try {
    let uid = req.params.id;
    let user = await UserModel.findByIdAndDelete(uid);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    console.log("DELETE /users/:id - Error occurred:", error);
    next(error);
  }
});

// UPDATE USER BY ID
userAPI.put("/users/:id", async (req, res, next) => {
  try {
    let uid = req.params.id;
    let modifiedUser = req.body;

    if (modifiedUser.dateOfBirth) {
      modifiedUser.dateOfBirth = normalizeDate(modifiedUser.dateOfBirth);
    }

    let updatedUser = await UserModel.findByIdAndUpdate(
      uid,
      { $set: modifiedUser },
      { new: true }
    );
    res.status(200).json({ message: "user updated", payload: updatedUser });
  } catch (error) {
    console.log("PUT /users/:id - Error occurred:", error);
    next(error);
  }
});

// Activate User
userAPI.patch("/users/:id", async (req, res, next) => {
  try {
    let uid = req.params.id;
    let modifiedUser = req.body;

    if (modifiedUser.dateOfBirth) {
      modifiedUser.dateOfBirth = normalizeDate(modifiedUser.dateOfBirth);
    }

    let User = await UserModel.findByIdAndUpdate(
      uid,
      { $set: modifiedUser },
      { new: true }
    );
    res.status(200).json({ message: "user activated", payload: User });
  } catch (error) {
    console.log("PATCH /users/:id - Error occurred:", error);
    next(error);
  }
});

export default userAPI;