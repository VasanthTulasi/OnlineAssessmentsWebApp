const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const corsConfig = {
  credentials: true,
  origin: true,
};

app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use(express.json());
mongoose.connect(
  "mongodb+srv://lalithavasanth10:Pmbcem08@onlineexamcluster.x1ohh.mongodb.net/OnlineExamWebAppDB?retryWrites=true&w=majority"
);

const PendingRegistrationsRoute = require("./routes/PendingRegistrationsRoute");
const UsersRoute = require("./routes/UsersRoute");
const ModulesRoute = require("./routes/ModulesRoute");

app.use("/pendingregistrations", PendingRegistrationsRoute);
app.use("/users", UsersRoute);
app.use("/modules", ModulesRoute);

app.listen(3001, () => {
  console.log("Server is good");
});
