const TimeSheet = require('../models/timeSheet')

const getTimeSheets = (req, res, next) => {
  TimeSheet.find()
    .then((times) => {
      return res.status(200).json(times)
    })
    .catch(error => {
      console.error(error)
      return res.status(500)
    })
}

exports.getTimeSheets = getTimeSheets

const insertTimeSheet = (req, res, next) => {
  const {email, message, submitted, day, month, year} = req.body
  console.log(email, message, submitted, day, month, year)
  TimeSheet.create({email, message, submitted, day, month, year})
    .then((model) => {
      console.log(model)
      return res.status(200).json({result: 'done'})
    })
    .catch(error => {
      console.error(error)
      return res.status(500)
    })
}

exports.insertTimeSheet = insertTimeSheet
