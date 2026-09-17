import express from "express";

import cors from "cors";

import errorHandler from "./middlewares/errorHandler.js";

import authRoute from "../src/routes/authRoutes.js";

import userRoute from "../src/routes/userRoutes.js";

import tenantInvitationRoute from "../src/routes/tenantInvitationRoutes.js";

import tenantRoute from "../src/routes/tenantRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/tenanthub", authRoute);

app.use("/users", userRoute);

app.use(
  "/tenant-invitations",
  tenantInvitationRoute
);

app.use("/tenants", tenantRoute);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HRMS Backend Running",
  });
});

app.use((req, res, next) => {
  const error = new Error("Route not found");

  error.statusCode = 404;

  next(error);
});

app.use(errorHandler);

export default app;