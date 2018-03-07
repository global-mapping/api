const TimeSheet = require('../models/timeSheet')
const User = require('../models/user')
const {getUserInfo, getUserByEmail} = require('./api')
const moment = require('moment')

const getTimeSheets = (req, res, next) => {
  const token = req.get('token')
  getUserInfo(token)
    .then(user => {
      if (!user) return res.status(500)

      return TimeSheet
        .find({email: user.email})
        .sort({ createdAt: -1 })
        .limit(50)
    })
    .then((times) => res.status(200).json(times))
    .catch(e => res.status(500).send({error: e.message, stack: e.stack}))
}

const updateUserProfile = (req, res, next) => {
  const userUpdated = req.body
  const token = req.get('token')

  User.findByIdAndUpdate(userUpdated._id, {
    role: userUpdated.role,
    area: userUpdated.area,
  })
  .then(() => User.find())
  .then(users => res.status(200).json(users))
  .catch(e => res.status(500).send({error: e.message, stack: e.stack}))
}

const saveTimeSheets = (req, res, next) => {
  const {timeSheets, userId} = req.body
  const token = req.get('token')

  getUserInfo(token)
    .then(user => {
      if (!user) return res.status(500)

      return User.findById(userId)
    })
    .then(user => {
      if (!user) return res.status(500)

      const promises = Object.keys(timeSheets).map((dayKey) => {
        return TimeSheet.findOneAndUpdate(
          {
            email: user.email,
            dayKey
          },
          {
            email: user.email,
            message: timeSheets[dayKey],
            user,
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
  let report = {}
  getUserInfo(token)
    .then(user => {
      if (!user) return res.status(500).send({error: 'user not found'})
      
      // todo: filter by role and permissions
      return TimeSheet
        .find({ dayKey: { $in: dateKeys } })
        .sort({ createdAt: -1 })
    })
    .then((times) => {
      times.forEach(t => {
        if (!report[t.email]) {
          report[t.email] = []
        }
        report[t.email].push(t)
      })
      return User.find()
    })
    .then(users => {
      res.status(200).json({users, report})
    })
    .catch(e => res.status(500).send({error: e.message, stack: e.stack}))
}

const updateCreateUser = (req, res, next) => {
  const token = req.get('token')

  getUserInfo(token)
    .then(user => {
      if (!user) return res.status(500)

      return User.findOneAndUpdate(
        {
          email: user.email,
        },
        {
          email: user.email,
          name: user.name,
          picture: user.picture,
          nickname: user.nickname
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      )
    })
    .then(user => {
      res.status(200).json({id: user._id})
    })
    .catch((err) => {
      console.error(err)
      return res.status(500)
    })
}

getDateKey = date => `${date.year()}-${date.month() + 1}-${date.date()}`

const getUsers = (req, res, next) => {
  const token = req.get('token')
  getUserInfo(token) // TODO: check super admin only
    .then(user => {
      if (!user) return res.status(500)
      return User.find()
    })
    .then(users => res.status(200).json(users))
    .catch((err) => {
      console.error(err)
      return res.status(500)
    })
}

exports.getUsers = getUsers
exports.getTimeSheets = getTimeSheets
exports.saveTimeSheets = saveTimeSheets
exports.reportByWeek = reportByWeek
exports.updateCreateUser = updateCreateUser
exports.updateUserProfile = updateUserProfile
