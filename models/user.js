import mongoose from "mongoose";
import { usersDB } from "../db/usersDB.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [4, "Name should not be less than 4 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // auto-converts to lowercase
      trim: true, // removes extra spaces from start/end
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [18, "Password must not exceed 20 characters"],
      validate: {
        validator: function (value) {
          // value will have the value of input password
          // Regex explanation:
          // (?=.*[a-z])        -> at least one lowercase letter
          // (?=.*[A-Z])        -> at least one uppercase letter
          // (?=.*\d)           -> at least one digit
          // (?=.*[!@#$%^&*])   -> at least one special character (can expand list if needed)
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value);
        },
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)",
      },
    },
  }
);

const UserModel = usersDB.model("User", userSchema);

export default UserModel;

// { collection: "users" } // <-- this tells Mongoose to use the "users" collection
