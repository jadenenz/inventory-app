const express = require("express")
const router = express.Router()
const producerRoute = require("../controllers/producerControllers")

// GET request for all producer
router.get("/", producerRoute.producer_list)

// POST request for creating producer
router.post("/create", producerRoute.producer_create_post)

// GET request for individual producer, dynamic based on objectId
router.get("/:id", producerRoute.producer_detail)

module.exports = router
