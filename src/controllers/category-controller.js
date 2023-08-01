import categoryService from "../services/category-service.js";

const get = async (req, res, next) => {
  try {
    const result = await categoryService.get();

    res.status(200).set("Cache-Control", "public, max-age=120, s-maxage=1, stale-while-revalidate=30").json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { get };
