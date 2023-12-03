import express from "express";
import cartController from "../controllers/cart-controller.js";
import categoryController from "../controllers/category-controller.js";
import orderController from "../controllers/order-controller.js";
import productController from "../controllers/product-controller.js";
import tagController from "../controllers/tag-controller.js";
import userController from "../controllers/user-controller.js";
import { guestMiddleware } from "../middleware/guest-middleware.js";
import paymentController from "../controllers/payment-controller.js";
import feedbackController from "../controllers/feedback-controller.js";

const publicRouter = new express.Router();

publicRouter.post("/api/users/login", userController.login);
publicRouter.post("/api/users", userController.register);
publicRouter.get("/api/users/guest", userController.createGuestUser);

publicRouter.get("/api/products", productController.infinite);
publicRouter.get("/api/products/search", productController.search);
publicRouter.get("/api/products/best-rated", productController.getBestRated);
publicRouter.get("/api/products/:slug", productController.get);

publicRouter.get("/api/tags", tagController.get);
publicRouter.get("/api/tags/:productCategory", tagController.getByCategory);

publicRouter.get("/api/categories", categoryController.get);

publicRouter.post("/api/carts/validate", cartController.validateCart);

publicRouter.use(guestMiddleware);

publicRouter.post("/api/orders", orderController.create);
publicRouter.get("/api/orders/:orderId", orderController.get);
publicRouter.post("/api/orders/checkout", orderController.checkout);
publicRouter.post("/api/orders/:orderId/cancel", orderController.cancel);

publicRouter.get("/api/payment/:sessionId", paymentController.get);

publicRouter.post("/api/feedback", feedbackController.create);

export { publicRouter };
