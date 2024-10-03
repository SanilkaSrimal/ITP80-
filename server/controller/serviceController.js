import mongoose from "mongoose";
import Service from "../model/Service.js";

export const getUserServices = async (req, res) => {
  try {
    const services = await Service.find().populate("user");
    res.status(200).json(services);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createUserService = async (req, res) => {
  const service = req.body;
  const newService = new Service(service);
  try {
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getUserService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    res.status(200).json(service);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUserService = async (req, res) => {
  const { id } = req.params;
  const service = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No service with id: ${id}`);

  const updatedService = await Service.findByIdAndUpdate(id, service, {
    new: true,
  });
  res.json(updatedService);
};

export const deleteUserService = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No service with id: ${id}`);

  await Service.findByIdAndDelete(id);
  res.json({ message: "Service deleted successfully." });
};

export const getUserServicesByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const services = await Service.find({ user: id }).populate("user");
    res.status(200).json(services);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
