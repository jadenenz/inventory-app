const Matcha = require("../models/matcha")
const Producer = require("../models/producer")
const Grade = require("../models/grade")

const async = require("async")
const { body, validationResult } = require("express-validator")

//helper function that returns a random number for stock
function getRandomNumber() {
  return Math.floor(Math.random() * 500)
}

//Display list of all Matcha
exports.matcha_list = (req, res, next) => {
  Matcha.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_matcha) {
      if (err) {
        return next(err)
      }
      //Successful, so send json
      res.json(list_matcha)
    })
}

//Display single matcha detail
exports.matcha_detail = (req, res, next) => {
  Matcha.findById(req.params.id)
    .populate("producer")
    .populate("grade")
    .exec(function (err, matcha_detail) {
      if (err) {
        return next(err)
      }
      //Successful, so send json
      res.json(matcha_detail)
    })
}

//Display matcha create form on GET
exports.matcha_create_get = (req, res, next) => {
  ;[
    //Get all producer and grades, to use for adding matcha
    async.parallel(
      {
        producers(callback) {
          Producer.find(callback)
        },
        grades(callback) {
          Grade.find(callback)
        },
      },
      (err, results) => {
        if (err) {
          return next(err)
        }
        //Else success so send json
        res.json(results)
      }
    ),
  ]
}

// POST form data to create new matcha
exports.matcha_create_post = [
  //Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("producer", "Producer must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("grade", "Grade must be selected").trim().isLength({ min: 1 }).escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),

  //Process request after validation and sanititation.
  (req, res, next) => {
    //Extract the validation errors from a request.
    const errors = validationResult(req)

    console.log(req.body)
    //Create Matcha object with escaped and trimmed data
    const matcha = new Matcha({
      name: req.body.name,
      description: req.body.description,
      producer: req.body.producer,
      price: req.body.price,
      grade: req.body.grade,
      stock: getRandomNumber(),
    })

    if (!errors.isEmpty()) {
      //Need to implement error handling differently than express templating did
      res.send(`Errors with form ${errors.array}`)
    }

    //Data from form is valid. Save matcha.
    matcha.save((err) => {
      if (err) {
        return next(err)
      }
      // Successful: so send success code. (FIGURE OUT HOW TO REDIRECT W/ NEXT.JS)
      res.status(201).send("Succesfully created resource")
    })
  },
]
