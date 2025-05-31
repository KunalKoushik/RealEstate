const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  profilePicture: {
    type: String,
    default: function() {
      // Default profile picture using user's initials
      const user = this._user || {};
      return `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName || ''} ${user.lastName || ''}`;
    }
  },
  socialLinks: {
    website: String,
    twitter: String,
    linkedin: String,
    facebook: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  preferences: {
    notificationEnabled: {
      type: Boolean,
      default: true
    },
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "whatsapp"],
      default: "email"
    }
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property"
  }],
  purchaseHistory: [{
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    amountPaid: Number,
    transactionId: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Automatically create a profile when a new user is created
profileSchema.statics.createForUser = async function(userId) {
  const Profile = this;
  const profile = new Profile({ user: userId });
  await profile.save();
  return profile;
};

// Update timestamp on save
profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for full address
profileSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.postalCode}, ${this.address.country}`;
});

module.exports = mongoose.model("Profile", profileSchema);