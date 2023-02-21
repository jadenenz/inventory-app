const Grade = require("../models/grade")
const Matcha = require("../models/matcha")

const async = require("async")
const { body, validationResult } = require("express-validator")

// Sends json list of all grades
exports.grades_list = (req, res, next) => {
  Grade.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_grades) {
      if (err) {
        return next(err)
      }
      //Successful, so send json
      res.json(list_grades)
    })
}

// Send json info about individual grade and all of the matcha available at that grade.
exports.grade_detail = (req, res, next) => {
  async.parallel(
    {
      grade: function (callback) {
        Grade.findById(req.params.id).exec(callback)
      },
      grade_matcha: function (callback) {
        Matcha.find({ grade: req.params.id }, "name").exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      } // Error in API usage.
      if (results.grade == null) {
        // No results.
        const err = new Error("Grade not found")
        err.status = 404
        return next(err)
      }
      // Successful, so send json.
      res.json(results)
    }
  )
}

exports.grade_create_post = [
  //Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

  //Process request after validation and sanititation.
  (req, res, next) => {
    //Extract the validation errors from a request.
    const errors = validationResult(req)

    //Create Grade object with escaped and trimmed data
    const grade = new Grade({
      name: req.body.name,
      description: req.body.description,
    })
    if (!errors.isEmpty()) {
      //Need to implement error handling differently than express templating did
      res.send(`Errors with form ${errors.array}`)
    }

    //Data from form is valid. Save matcha.
    grade.save((err) => {
      if (err) {
        return next(err)
      }
      // Successful: so send success code. (FIGURE OUT HOW TO REDIRECT W/ NEXT.JS)
      res.status(201).send("Succesfully created resource")
    })
  },
]
