const Producer = require("../models/producer")
const Matcha = require("../models/matcha")

const async = require("async")
const { body, validationResult } = require("express-validator")
const matcha = require("../models/matcha")

// Display list of all producers
exports.producer_list = (req, res, next) => {
  Producer.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_producers) {
      if (err) {
        return next(err)
      }
      //Successful, so send json
      res.json(list_producers)
    })
}

// Provide details for a single producer and a list of all matcha made by that producer
exports.producer_detail = (req, res, next) => {
  async.parallel(
    {
      producer: function (callback) {
        Producer.findById(req.params.id).exec(callback)
      },

      producer_matcha: function (callback) {
        Matcha.find({ author: req.params.id }, "name description").exec(
          callback
        )
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      } // Error in API usage
      if (results.producer == null) {
        // No results
        const err = new Error("Producer not found")
        err.status = 404
        return next(err)
      }
      // Successful so send json
      res.json(results)
    }
  )
}

// POST form data to create new producer
exports.producer_create_post = [
  //Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  //Process request after validation and sanititation.
  (req, res, next) => {
    //Extract the validation errors from a request.
    const errors = validationResult(req)

    //Create Producer object with escaped and trimmed data
    const producer = new Producer({
      name: req.body.name,
      description: req.body.description,
    })
    if (!errors.isEmpty()) {
      //Need to implement error handling differently than express templating did
      res.send(`Errors with form ${errors.array}`)
    }

    //Data from form is valid. Save matcha.
    producer.save((err) => {
      if (err) {
        return next(err)
      }
      // Successful: so send success code. (FIGURE OUT HOW TO REDIRECT W/ NEXT.JS)
      res.status(201).send("Succesfully created resource")
    })
  },
]
