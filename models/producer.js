const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ProducerSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
})

// Export model
module.exports = mongoose.model("Producer", ProducerSchema)
