const express = require("express")
const router = express.Router()
const matchaRoute = require("../controllers/matchaControllers")

// GET request for all matcha
router.get("/", matchaRoute.matcha_list)

// GET request for creating matcha. Must come before dynamic routes
router.get("/create", matchaRoute.matcha_create_get)

// POST request for creating Matcha
router.post("/create", matchaRoute.matcha_create_post)

// GET request for individual matcha, dynamic based on objectId
router.get("/:id", matchaRoute.matcha_detail)

module.exports = router
