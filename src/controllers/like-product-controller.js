import likeProductService from "../services/like-product-service.js";

const like = async (req, res, next) => {
  try {
    const username = req.user.username;
    const productSlug = req.params.productSlug;
    const request = {};
    request.username = username;
    request.productSlug = productSlug;

    const result = await likeProductService.like(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const neutral = async (req, res, next) => {
  try {
    const username = req.user.username;
    const productSlug = req.params.productSlug;
    const request = {};
    request.username = username;
    request.productSlug = productSlug;

    const result = await likeProductService.neutral(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { like, neutral };
