const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());
mongoose.connect(
  "mongodb+srv://lalithavasanth10:Pmbcem08@onlineexamcluster.x1ohh.mongodb.net/OnlineExamWebAppDB?retryWrites=true&w=majority"
);

const PendingRegistrationsRoute = require("./routes/PendingRegistrationsRoute");

app.use("/pendingregistrations", PendingRegistrationsRoute);

app.listen(3001, () => {
  console.log("Server is good");
});
