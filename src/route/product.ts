import { Router } from "express";

import ProductController from "../controller/Product.controller";
import Middleware from "../controller/Middleware";

const productRouter = Router();

productRouter.get("/", ProductController.products);
productRouter
  .route("/:id")
  .get(ProductController.product)
  .put(
    Middleware.authorize(["admin", "super-admin"]),
    ProductController.editProduct
  )
  .delete(
    Middleware.authorize(["super-admin"]),
    ProductController.deleteProduct
  );
productRouter.post(
  "/new",
  Middleware.authorize(["admin", "super-admin"]),
  ProductController.newProduct
);
export default productRouter;
