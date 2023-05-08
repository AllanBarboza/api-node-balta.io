const express = require("express");
const router = express.Router();

const controllers = require("../controllers/customer-controller");

router.post("/", controllers.post);


module.exports = router;
