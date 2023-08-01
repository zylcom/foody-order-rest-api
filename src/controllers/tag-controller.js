import tagService from "../services/tag-service.js";

const get = async (req, res, next) => {
  try {
    const result = await tagService.get();

    res.status(200).set("Cache-Control", "public, max-age=120, s-maxage=1, stale-while-revalidate=30").json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getByCategory = async (req, res, next) => {
  try {
    const category = req.params.productCategory;
    const result = await tagService.getByCategory(category);

    res.status(200).set("Cache-Control", "public, max-age=120, s-maxage=1, stale-while-revalidate=30").json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { get, getByCategory };
