import productService from "../services/product-service.js";

const get = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const result = await productService.get(slug);

    res.status(200).set("Cache-Control", "public, max-age=120, s-maxage=1, stale-while-revalidate=30").json({ data: result });
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const request = {
      category: req.query?.category,
      name: req.query?.name,
      tag: req.query?.tag,
      size: req.query?.size,
      page: req.query?.page,
      getAll: req.query.all === "true" ? true : false,
    };

    const result = await productService.search(request);

    res.status(200).set("Cache-Control", "public, max-age=0, s-maxage=1, stale-while-revalidate=30").json({ data: result.data, paging: result.paging });
  } catch (error) {
    next(error);
  }
};

const infinite = async (req, res, next) => {
  try {
    const request = {
      category: req.query.category,
      name: req.query.name,
      tag: req.query.tag,
      size: req.query.size,
      cursor: req.query.cursor,
    };
    const result = await productService.infinite(request);

    res.status(200).set("Cache-Control", "public, max-age=60, s-maxage=1, stale-while-revalidate=30").json({ data: result.data, paging: result.paging });
  } catch (error) {
    next(error);
  }
};

const getBestRated = async (req, res, next) => {
  try {
    const category = req.query.category;

    const result = await productService.getBestRated(category);

    res.status(200).set("Cache-Control", "public, max-age=0, s-maxage=1, stale-while-revalidate=30").json({ data: result });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const request = {
      ...req.body,
    };

    const result = await productService.update(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const slug = req.params.productSlug;

    await productService.deleteProduct(slug);

    res.status(200).json({ data: "Deleted!" });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const request = req.body;

    const result = await productService.create(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { create, get, search, infinite, getBestRated, update, deleteProduct };
