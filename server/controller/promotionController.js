import Coupon from "../model/Coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = req.body;

    const newCoupon = new Coupon(coupon);

    await newCoupon.save();

    res.status(201).json({ coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.status(200).json({ coupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = req.body;

    const existingCoupon = await Coupon.findById(id);

    if (!existingCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    existingCoupon.couponCode = coupon.couponCode || existingCoupon.couponCode;
    existingCoupon.discount = coupon.discount || existingCoupon.discount;
    existingCoupon.expiryDate = coupon.expiryDate || existingCoupon.expiryDate;

    const updatedCoupon = await existingCoupon.save();

    res.status(200).json({ coupon: updatedCoupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    await Coupon.findByIdAndDelete(id);

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const coupon = await Coupon.findOne({ couponCode });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
