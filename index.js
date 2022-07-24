const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://kyujin:kor2an4m2@boilerplate.hr4qvkr.mongodb.net/?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("hello world"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
