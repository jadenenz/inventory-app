const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MatchaSchema = new Schema({
  name: { type: String, required: true },
  producer: { type: Schema.Types.ObjectId, ref: "Producer", required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  grade: { type: Schema.Types.ObjectId, ref: "Grade", required: true },
  stock: { type: Number, required: true },
})

// Export model
module.exports = mongoose.model("Matcha", MatchaSchema)
