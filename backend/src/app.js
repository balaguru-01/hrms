const express = require("express");
const cors = require("cors");

const enterpriseRoute = require('./routes/enterpriseRoute')

const app = express();

app.use(cors());
app.use(express.json());

 app.use('/enterprise',enterpriseRoute)

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HRMS Backend Running"
  });
});



module.exports = app;