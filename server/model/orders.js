import mongoose, { disconnect } from "mongoose";

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      name: { type: String, required: true },
      selectedQuantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  orderStatus:{
    type: String,
    default: "Pending",
  
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
