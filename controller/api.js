const axios = require('axios')

const { API_URL, API_TOKEN } = process.env

exports.getUserInfo = (token) => {
  return axios({
    url: `${API_URL}/userinfo`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  .then(({ data: user }) => user)
}

exports.getUserByEmail = (email) => {
  return axios({
    url: `${API_URL}/api/v2/users-by-email?email=${email}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    },
  })
  .then(({ data: user }) => user)
  .catch(error => {
    console.error(error)
  })
}
