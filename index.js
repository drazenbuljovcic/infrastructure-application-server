const express = require("express");
var morgan = require("morgan");

require("dotenv").config();

const app = express();

app.use(morgan("combined"));

const permissions = {
  consumers: [{ identifier: "My-Living-Room", permissions: "ALL" }],
};

app.get("/distributed-information-node", async (req, res) => {
  const { sleep } = req.query;

  if (sleep) {
    await new Promise((resolve) => setTimeout(resolve, sleep || 2000));
  }

  return res.json(permissions);
});

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
