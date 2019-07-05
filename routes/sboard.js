var r = require("express").Router();
var controller = require("../controllers/sboard.js");

r.get("/",controller.page);
r.get("/:id",controller.client);

module.exports = r;