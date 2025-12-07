import mongoose from "mongoose";
import { config } from "@config/env";
import { User } from "@models/User.model";

async function ensureTestUser() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.mongodb.uri);
    console.log("Connected to MongoDB");

    const email = "test@gmail.com";
    const password = "test1234";

    let user = await User.findOne({ email });

    if (user) {
      console.log("User already exists.");
      // Update password just in case
      user.password = password;
      await user.save();
      console.log("Updated user password to ensure it matches.");
    } else {
      console.log("User not found. Creating...");
      user = new User({
        email,
        password,
        name: "Test Analyst",
        role: "admin",
        isActive: true,
      });
      await user.save();
      console.log("Created new user.");
    }

    console.log("User details:");
    console.log(`Email: ${user.email}`);
    console.log(`ID: ${user._id}`);
  } catch (error) {
    console.error("Error ensuring test user:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

ensureTestUser();
