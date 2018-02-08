const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TimeSheetSchema = new Schema(
  {
    email: { type: String },
    message: { type: String },
    dayKey: { type: String },
  },
  { timestamps: true },
)

module.exports = mongoose.model('timeSheet', TimeSheetSchema)
