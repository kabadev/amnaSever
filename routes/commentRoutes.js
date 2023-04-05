import { createItem, deleteItem } from "../controller/commentController.js";
export const commentRoutes = (router) => {
  router.post("/api/comments", createItem);
  router.delete("/api/comments/:id", deleteItem);
};
