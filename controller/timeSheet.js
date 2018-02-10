const TimeSheet = require('../models/timeSheet')
const {getUserInfo} = require('./api')

const getTimeSheets = (req, res, next) => {
  const token = req.get('token')
  getUserInfo(token)
    .then(user => {
      if (!user) res.status(500)
      return TimeSheet
        .find({email: user.email})
        .sort( { createdAt: -1 } )
        .limit(50)
    })
    .then((times) => res.status(200).json(times))
    .catch(error => res.status(500))
}

const saveTimeSheets = (req, res, next) => {
  const timeSheets = req.body
  const token = req.get('token')

  getUserInfo(token)
    .then(user => {
      if (!user) res.status(500)

      const promises = Object.keys(timeSheets).map((dayKey) => {
        return TimeSheet.findOneAndUpdate(
          {
            email: user.email,
            dayKey
          },
          {
            email: user.email,
            message: timeSheets[dayKey],
            dayKey
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          },
        )
      })

      return Promise.all(promises)
    })
    .then(() => res.status(200).json({success: 'done'}))
    .catch(err => res.status(500))
}

exports.getTimeSheets = getTimeSheets
exports.saveTimeSheets = saveTimeSheets
