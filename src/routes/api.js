import express from "express";
import cartController from "../controllers/cart-controller.js";
import userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import cartItemController from "../controllers/cart-item-controller.js";
import reviewController from "../controllers/review-controller.js";
import likeProductController from "../controllers/like-product-controller.js";
import orderController from "../controllers/order-controller.js";

const userRouter = new express.Router();

userRouter.use(authMiddleware);
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

userRouter.get("/api/users/current/carts", cartController.get);

userRouter.get("/api/users/current/carts/items", cartItemController.get);
userRouter.get("/api/users/current/carts/items/:productSlug", cartItemController.find);
userRouter.put("/api/users/current/carts/items", cartItemController.upsert);
userRouter.delete("/api/users/current/carts/items/:itemId", cartItemController.remove);

userRouter.post("/api/products/reviews", reviewController.create);
userRouter.put("/api/products/reviews", reviewController.update);

userRouter.post("/api/products/:productSlug/like", likeProductController.like);
userRouter.delete("/api/products/:productSlug/like", likeProductController.neutral);

userRouter.post("/api/orders", orderController.create);
userRouter.get("/api/orders/:orderId", orderController.get);
userRouter.post("/api/orders/checkout", orderController.checkout);

export { userRouter };
