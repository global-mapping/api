const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: { type: String },
    name: { type: String },
    nickname: { type: String },
    picture: { type: String },
    role: { type: String },
    area: { type: String }
  },
  { timestamps: true }
)

module.exports = mongoose.model('user', UserSchema)
