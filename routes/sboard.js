var r = require("express").Router();
var controller = require("../controllers/sboard.js");

r.get("/",controller.page);

module.exports = r;