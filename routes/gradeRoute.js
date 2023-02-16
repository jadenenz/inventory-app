const express = require("express")
const router = express.Router()
const gradeRoute = require("../controllers/gradeControllers")

// GET request for all grades
router.get("/", gradeRoute.grades_list)

// POST request for creating grade
// router.post("/create", gradeRoute.grade_create_post)

// GET request for individual grade, dynamic based on objectId
router.get("/:id", gradeRoute.grade_detail)

module.exports = router
