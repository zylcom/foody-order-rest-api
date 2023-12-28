import express from "express";
import cartController from "../controllers/cart-controller.js";
import userController from "../controllers/user-controller.js";
import cartItemController from "../controllers/cart-item-controller.js";
import reviewController from "../controllers/review-controller.js";
import likeProductController from "../controllers/like-product-controller.js";
// import productController from "../controllers/product-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();

userRouter.use(authMiddleware);
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update); // documented
// userRouter.delete("/api/users/logout", userController.logout);

userRouter.get("/api/carts", cartController.get); // documented
userRouter.post("/api/carts/clear", cartController.clearCart); // documented

userRouter.get("/api/carts/items", cartItemController.get); // documented
userRouter.get("/api/carts/items/:productSlug", cartItemController.find); // documented
userRouter.put("/api/carts/items", cartItemController.upsert); // documented
userRouter.delete("/api/carts/items/:productSlug", cartItemController.remove); // documented

userRouter.post("/api/products/reviews", reviewController.create); // documented
userRouter.put("/api/products/reviews", reviewController.update); // documented

userRouter.post("/api/products/:productSlug/like", likeProductController.like); // documented
userRouter.delete("/api/products/:productSlug/like", likeProductController.neutral); // documented

// userRouter.post("/api/products/create", productController.create);
// userRouter.put("/api/products", productController.update);
// userRouter.delete("/api/products/:productSlug", productController.deleteProduct);

export { userRouter };
