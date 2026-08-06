const express = require("express");
const cors = require("cors");
const {errorHandler} = require("../src/middlewares/errorHandler")

const enterpriseRoute = require('./routes/enterpriseRoute')
const tenantRoute = require('./routes/tenantRoute')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/enterprise',enterpriseRoute)
app.use('/tenant',tenantRoute)

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HRMS Backend Running"
  });
});

app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
});

app.use(errorHandler)

module.exports = app;