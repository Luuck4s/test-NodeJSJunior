const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const models = require("./models/postgres");
const app = express();

/**
 * Creation of the necessary tables
 */
models();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(8080, () => {
  console.log("[SERVER] server inicialized http://localhost:8080");
});
