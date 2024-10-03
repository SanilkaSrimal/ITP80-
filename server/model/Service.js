import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  productName: {
    type: String,
  },
  productID: {
    type: String,
  },
  productPurchasedDate: {
    type: Date,
  },
  productWarrantyPeriod: {
    type: String,
  },
  claimDescription: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Pending",
  },
});

const Service = mongoose.model("Service", ServiceSchema);

export default Service;
