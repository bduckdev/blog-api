const express = require("express");
const app = express();

app.get("/", (_, res) => {
  res.send("cool beans");
});

app.listen(3000);
