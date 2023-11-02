import feedbackService from "../services/feedback-service.js";

const create = async (req, res, next) => {
  try {
    const request = {
      username: req?.user?.username,
      guestUserId: req.guestUserId,
      description: req.body.description,
    };

    await feedbackService.create(request);

    res.status(200).json({ data: "Feedback sent" });
  } catch (error) {
    next(error);
  }
};

export default { create };
