const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("../../config/winston");

const SALT_WORK_FACTOR = 10;

// defining all the fields of individual account
const accountsSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
      max: 32,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    hash: String,
    salt: String,
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["guest", "admin", "company", "user"],
      default: "user",
    },
    accountType: {
      type: String,
      enum: ["premium", "normal"],
      default: "normal",
    },
    contactNo: {
      type: String,
      unique: true,
    },
    gender: {
      type: String,
      description: "can be male,female & others",
      enum: ["male", "female", "others"],
    },
    // it must be empty
    // if null, it will create an duplicateError
    secondaryEmail: {
      type: String,
      lowercase: true,
      unique: false,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "O+", "O-", "AB+", "AB-", "B+", "B-"],
    },
    location: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      max: 250,
      trim: true,
    },
    skillArea: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkillArea",
      },
    ],
    companies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    jobExperience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobexperience",
      },
    ],
    education: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Education",
      },
    ],
    version: {
      type: Number,
      default: 0,
    },
    language: {
      type: mongoose.Schema.Types.String,
      default: "en",
      enum: ["en", "bn"],
    },
  },
  {
    timestamps: true,
  }
);

accountsSchema.index({ email: 1, secondaryEmail: 1 }, { unique: true });

accountsSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    logger.error(`Account: ${error}`);
    return next(error);
  }
});

accountsSchema.methods.comparePassword = async function (data) {
  return bcrypt.compare(data, this.password);
};

module.exports = mongoose.model("Account", accountsSchema);
