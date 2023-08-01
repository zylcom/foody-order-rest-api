import cartService from "../services/cart-service.js";

const get = async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await cartService.get(username);

    res.status(200).set("Cache-Control", "private, max-age=3, must-revalidate").json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { get };
