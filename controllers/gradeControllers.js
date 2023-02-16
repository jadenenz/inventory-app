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
