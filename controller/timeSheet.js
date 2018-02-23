const TimeSheet = require('../models/timeSheet')
const {getUserInfo} = require('./api')
const moment = require('moment')

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
  const start = moment(req.params.startDate, 'YYYY-MM-DD')
  const startKey = getDateKey(start)
  const numDays = [1,2,3,4,5,6,7]
  let curr = moment(start)

  const dateKeys = numDays.map(n => {
    curr.add(1, 'day')
    return getDateKey(curr)
  })

  getUserInfo(token)
    .then(user => {
      if (!user) res.status(500).send({error: 'user not found'})
      
      // todo: filter by role and permissions
      return TimeSheet
        .find({ dayKey: { $in: dateKeys } })
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

getDateKey = date => `${date.year()}-${date.month() + 1}-${date.date()}`

exports.getTimeSheets = getTimeSheets
exports.saveTimeSheets = saveTimeSheets
exports.reportByWeek = reportByWeek
