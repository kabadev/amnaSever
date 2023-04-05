import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// routes
import { userRoutes } from "./routes/userRoutes.js";
import { activityRoutes } from "./routes/activityRoutes.js";
import { participantRoutes } from "./routes/participantRoutes.js";
import { commentRoutes } from "./routes/commentRoutes.js";

const app = express();
dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb connected"))
  .catch((error) => console.log(error));
app.use(
  cors({
    origin: [
      process.env.ClIENT_URL,
      "http://localhost:3000",
      "http://localhost:3001",
    ],
  })
);
//midddlewares
app.use(express.json());
app.use(cookieParser());

userRoutes(app);
activityRoutes(app);
participantRoutes(app);
commentRoutes(app);

app.listen(process.env.PORT || 8000, () => {
  console.log("Server listening on port " + process.env.PORT);
});
