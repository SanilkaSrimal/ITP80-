import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: [true, "Suppler name is required"],
  },
  address: {
    type: String,
    required: [true, "Suppler address is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Suppler phone is required"],
  },
  email: {
    type: String,
    required: [true, "Suppler email is required"],
  },
  companyName: {
    type: String,
    required: [true, "Suppler company name is required"],
  },
  supplyProduct: {
    type: String,
    required: [true, "Suppler supply product is required"],
  },
});

const Supplier = mongoose.model("Supplier", SupplierSchema);

export default Supplier;
