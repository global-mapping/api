const TimeSheet = require('../models/timeSheet')
const {getUserInfo} = require('./api')

const getTimeSheets = (req, res, next) => {
  const token = req.get('token')
  getUserInfo(token)
    .then(user => {
      if (!user) res.status(500)
      return TimeSheet
        .find({email: user.email})
        .sort({ createdAt: -1 })
        .limit(50)
    })
    .then((times) => res.status(200).json(times))
    .catch(e => res.status(500).send({error: e.message, stack: e.stack}))
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
    .catch(e => res.status(500).send({error: e.message, stack: e.stack}))
}

const reportByWeek = (req, res, next) => {
  const token = req.get('token')
  getUserInfo(token)
    .then(user => {
      if (!user) res.status(500).send({error: 'user not found'})
      
      return TimeSheet
        .find() // todo: filter by role and permissions / filter by range date
        .sort({ createdAt: -1 })
    })
    .then((times) => {
      let result = {}
      times.forEach(t => {
        if (!result[t.email]) {
          result[t.email] = []
        }
        result[t.email].push(t)
      })
      res.status(200).json(result)
    })
    .catch(e => res.status(500).send({error: e.message, stack: e.stack}))
}

exports.getTimeSheets = getTimeSheets
exports.saveTimeSheets = saveTimeSheets
exports.reportByWeek = reportByWeek
