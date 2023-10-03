const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const routes = require("./src/routes");
const db = require("./src/database");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const app = express();

dotenv.config();
db.connect();
app.use(cors());
// app.use(logger("dev"));
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Connected to server with port: ${PORT}`);
});
