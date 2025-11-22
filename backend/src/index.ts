import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "./config/app.config";
import { HttpStatus } from "./config/http.config";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.OK).json({
    message: "Welcome",
  });
});

app.listen(config.PORT, async () => {
  console.log(
    `Server is listening on port ${config.PORT} in ${config.NODE_ENV}`,
  );
});