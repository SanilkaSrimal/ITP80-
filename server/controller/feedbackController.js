import Feedback from "../model/Feedback.js";

export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("order").populate("user");

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createFeedback = async (req, res) => {
  const { user, rating, feedback, order } = req.body;

  try {
    const newFeedback = new Feedback({
      user,
      rating,
      feedback,
      order,
    });

    await newFeedback.save();

    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};



export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
