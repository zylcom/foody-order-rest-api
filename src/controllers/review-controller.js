import reviewService from "../services/review-service.js";

const create = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    request.username = username;

    const result = await reviewService.create(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    request.username = username;

    const result = await reviewService.update(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { create, update };
