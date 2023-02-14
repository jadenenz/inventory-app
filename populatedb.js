#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
)

// Get arguments passed on command line
var userArgs = process.argv.slice(2)
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async")
var Matcha = require("./models/matcha")
var Producer = require("./models/producer")
var Grade = require("./models/grade")

var mongoose = require("mongoose")
var mongoDB = userArgs[0]
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

var grades = []
var matchas = []
var producers = []

function producerCreate(name, description, cb) {
  producerdetail = { name: name, description: description }

  var producer = new Producer(producerdetail)

  producer.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log("New Producer: " + producer)
    producers.push(producer)
    cb(null, producer)
  })
}

function gradeCreate(name, cb) {
  var grade = new Grade({ name: name })

  grade.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log("New grade: " + grade)
    grades.push(grade)
    cb(null, grade)
  })
}

function matchaCreate(name, producer, description, price, grade, stock, cb) {
  matchadetail = {
    name: name,
    producer: producer,
    description: description,
    price: price,
    grade: grade,
    stock: stock,
  }

  var matcha = new Matcha(matchadetail)
  matcha.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log("New matcha: " + matcha)
    matchas.push(matcha)
    cb(null, matcha)
  })
}

function createGradeProducers(cb) {
  console.log("create gradeProducers running")
  async.series(
    [
      function (callback) {
        producerCreate(
          "Jade Leaf Matcha",
          "Specializes in high quality, organic matcha at wholesale prices.",
          callback
        )
      },
      function (callback) {
        producerCreate(
          "Ippodo",
          "Kyoto based high quality matcha, offering a wide variety of matcha powders from the matcha capitol.",
          callback
        )
      },
      function (callback) {
        producerCreate(
          "Ito En",
          "Offers more affordable and accessible matcha powders from one of Japan's premier tea vendors.",
          callback
        )
      },
      function (callback) {
        gradeCreate("Ceremonial", callback)
      },
      function (callback) {
        gradeCreate("Classic Grade", callback)
      },
      function (callback) {
        gradeCreate("Kitchen Grade", callback)
      },
    ],
    // optional callback
    cb
  )
}

function createMatchas(cb) {
  console.log("createMatchas running")
  async.parallel(
    [
      function (callback) {
        matchaCreate(
          "Kuon (Eternity) - 20g",
          producers[1],
          "Kuon has a vivid green color, a long aftertaste, and a rich umami - hallmarks of a high-class matcha.",
          46,
          grades[0],
          378,
          callback
        )
      },
      function (callback) {
        matchaCreate(
          "Shoin - 20g",
          producers[1],
          "Shoin places firmly in our rich category. Its lingering finish and full umami character make it a wise choice for fans of a reflective, satisfying matcha teatime.",
          25,
          grades[1],
          284,
          callback
        )
      },
      function (callback) {
        matchaCreate(
          "Horai - 20g",
          producers[1],
          "Our recommendation for people new to our matcha, Horai is a more light-hearted. smooth tea in the rich category.",
          19,
          grades[2],
          122,
          callback
        )
      },
      function (callback) {
        matchaCreate(
          "Matcha + Green Tea Pyramid Sachet Tea Bags - Traditional",
          producers[0],
          "Our pyramid sachets provide optimal steeping by allowing the tea leaves to expand and the water to flow more freely.",
          10,
          grades[0],
          122,
          callback
        )
      },
      function (callback) {
        matchaCreate(
          "Organic Hojicha Powder - Teahouse Edition",
          producers[0],
          "Japan’s most prized green teas, tencha and gyokuro, are used in the crafting of this rare and unique style of hojicha.",
          16,
          grades[1],
          220,
          callback
        )
      },
      function (callback) {
        matchaCreate(
          "Japanese Matcha Premium",
          producers[2],
          "Our most versatile matcha combination, this bright and lively matcha works great in everything from a latte to overnight oats.",
          14,
          grades[1],
          500,
          callback
        )
      },
      function (callback) {
        matchaCreate(
          "Usucha Ceremonial Powder",
          producers[2],
          "The traditional tea ceremony favors this light-bodied matcha because of its easiness to drink and its savory sophistication on the tongue.",
          15,
          grades[0],
          37,
          callback
        )
      },
    ],
    // optional callback
    cb
  )
}

async.series(
  [createGradeProducers, createMatchas],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err)
    }
    // All done, disconnect from database
    console.log("async series ending")
    mongoose.connection.close()
  }
)
