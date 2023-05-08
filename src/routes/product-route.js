const express = require("express");
const router = express.Router();

const controllers = require("../controllers/products-controller");

router.get("/", controllers.get);
router.get("/:slug", controllers.getBySlug);
router.get("/admin/:id", controllers.getById);
router.get("/tags/:tag", controllers.getByTag);
router.post("/", controllers.post);
router.put("/:id", controllers.put);
router.delete("/", controllers.delete);

module.exports = router;
