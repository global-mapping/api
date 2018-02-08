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

const saveTimeSheets = (req, res, next) => {
  const timeSheets = req.body
  const token = req.get('token')

  const promises = Object.keys(timeSheets).map((dayKey) => {
    return TimeSheet.create({
      email: '',
      message: timeSheets[dayKey],
      dayKey
    })
  })

  Promise.all(promises)
    .then(() => es.status(200).json({result: 'done'}))
    .catch((err) => res.status(500))

  return res.status(200).json({success: 'done'})
}

exports.saveTimeSheets = saveTimeSheets
