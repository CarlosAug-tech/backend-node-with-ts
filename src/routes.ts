import { Router } from "express";
import multer from "multer";

import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import authMiddleware from "./app/middlewares/auth";
import FileController from "./app/controllers/FileController";
import SessionController from "./app/controllers/SessionController";
import adminAuth from "./app/middlewares/admin";
import ProductController from "./app/controllers/ProductController";
import CategoryController from "./app/controllers/CategoryController";

const routes = Router();
const upload = multer(multerConfig);

routes.get("/product/:id", ProductController.show);

routes.get("/products", ProductController.index);
routes.get("/categories", CategoryController.index);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.post("/files", upload.single("file"), FileController.store);

routes.use(adminAuth);

routes.post("/products", ProductController.store);
routes.post("/categories", CategoryController.store);

export default routes;
