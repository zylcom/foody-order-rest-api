import categoryService from "../services/category-service.js";

const get = async (req, res, next) => {
  try {
    const result = await categoryService.get();

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { get };
