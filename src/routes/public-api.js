import express from "express";
import userController from "../controllers/user-controller.js";
import productController from "../controllers/product-controller.js";
import tagController from "../controllers/tag-controller.js";
import categoryController from "../controllers/category-controller.js";

const publicRouter = new express.Router();

publicRouter.post("/api/users/login", userController.login);
publicRouter.post("/api/users", userController.register);

publicRouter.get("/api/products", productController.infinite);
publicRouter.get("/api/products/search", productController.search);
publicRouter.get("/api/products/best-rated", productController.getBestRated);
publicRouter.get("/api/products/:slug", productController.get);

publicRouter.get("/api/tags", tagController.get);
publicRouter.get("/api/tags/:productCategory", tagController.getByCategory);

publicRouter.get("/api/categories", categoryController.get);

export { publicRouter };
