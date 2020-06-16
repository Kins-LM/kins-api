const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const html = fs.readFileSync("index.html");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const cors = require("cors");

require("dotenv").config();

//import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

app.use(cookieParser())
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.writeHead(200);
  res.write(html);
  res.end();
});
//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

//db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

app.listen(port, () => {
  console.log(`Server is listenning on port ${port}`);
});
