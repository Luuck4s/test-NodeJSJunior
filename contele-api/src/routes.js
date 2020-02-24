const { Router } = require("express");

const OrderController = require("./controllers/OrderController");

const routes = Router();

routes.get("/", OrderController.index);
routes.get("/orders", OrderController.orders);
routes.post("/order", OrderController.order);

module.exports = routes;
