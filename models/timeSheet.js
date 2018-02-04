const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TimeSheetSchema = new Schema(
  {
    email: { type: String },
    message: { type: String },
    submitted: { type: Boolean, default: false },
    day: { type: Number },
    month: { type: Number },
    year: { type: Number },
    week: { type: Number },
  },
  { timestamps: true },
)

module.exports = mongoose.model('timeSheet', TimeSheetSchema)
