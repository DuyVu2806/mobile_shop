import mongoose from"mongoose";

const customerSchema = mongoose.Schema(
  {
    
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
