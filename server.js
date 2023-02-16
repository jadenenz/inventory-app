require("dotenv").config()
const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const cors = require("cors")

const matchaRouter = require("./routes/matchaRoute")
const producerRouter = require("./routes/producerRoute")
const gradeRouter = require("./routes/gradeRoute")

//Set up a mongoDB connection
const mongoose = require("mongoose")
//suppress mongoose deprecation warning
mongoose.set("strictQuery", true)
const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, { useNewURlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// )
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(express.json())

//enable all cors requests
app.use(cors())
app.use("/matcha/", matchaRouter)
app.use("/producers/", producerRouter)
app.use("/grades/", gradeRouter)

app.listen(3001, () => {
  console.log("server running on port 3001")
})
