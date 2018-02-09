const axios = require('axios')

const { API_URL } = process.env

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