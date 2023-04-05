import {
  createItem,
  updateItem,
  deleteItem,
  getItem,
  getAllItems,
  activitySearch,
} from "../controller/activityController.js";

export const activityRoutes = (router) => {
  router.post("/api/activities", createItem);
  router.get("/api/activities", getAllItems);
  router.get("/api/activitySearch", activitySearch);
  router.put("/api/activities/:id", updateItem);
  router.delete("/api/activities/:id", deleteItem);
  router.get("/api/activities/:id", getItem);
};
