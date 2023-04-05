import {
  create,
  Login,
  getUser,
  getAllUser,
} from "../controller/userController.js";

export const userRoutes = (router) => {
  router.post("/api/users", create);
  router.post("/api/users/login", Login);
  router.get("/api/users/:id", getUser);
  router.get("/api/users", getAllUser);
};
