import {
  createItem,
  deleteItem,
  getItem,
  getAllItems,
  getCount,
  getCountChart,
  getCountAge,
} from "../controller/participantController.js";
export const participantRoutes = (router) => {
  router.post("/api/participants", createItem);
  router.get("/api/participants", getAllItems);
  router.get("/api/participantCount", getCount);
  router.get("/api/getCountChart", getCountChart);
  router.get("/api/getCountAge", getCountAge);
  router.delete("/api/participants/:id", deleteItem);
  router.get("/api/participants/:id", getItem);
};
