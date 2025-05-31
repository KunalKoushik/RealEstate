const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    aadhaarNumber: {
      type: String,
      required: true,
      length: 12,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v);
        },
        message: "Aadhaar number must be 12 digits long.",
      },
    },
    // role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    accountType: {
      type: String,
      enum: ["Admin", "Client"],
      // required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
      required: true,
    },
    contactNumber: {
      type: Number,
      trim: true,
      required: true,
    },
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    // content
    image: {
      type: String,
      required: true,
    },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    feedback: { type: String },
    properties: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    }],
    purchasedProperties: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    }],
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    }],
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile"
    }
  },
  { timestamps: true }
); // Enabling timestamp

const User = mongoose.model("User", UserSchema);
module.exports = User;
