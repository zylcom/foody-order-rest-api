import tagService from "../services/tag-service.js";

const get = async (req, res, next) => {
  try {
    const filter = { categorySlug: req.query.category };
    const result = await tagService.get(filter);

    res.status(200).set("Cache-Control", "public, max-age=120, s-maxage=1, stale-while-revalidate=30").json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { get };
