'use strict'
const express = require('express');
const app = express()
const port = process.env.PORT || 3000
const githubUri = 'https://api.github.com'
const axios = require('axios')

app.get('/users', getUsers, (req, res) => {
  res.send(res.filteredData);
})

/***GET users API call using axios ***/
function getUsers(req, res, next) {
  console.log('hitting');
  axios.get(`${githubUri}/users?since=1000`)
  .then((response) => {
    console.log(response);
      res.filteredData = mapReduce(response.data)
      next();
  })
  .catch((err) => {
    if(err) {
      res.tooManyRequestPerHrError = (err.statusCode === 403) ? err.message : undefined
      res.error = err
      next();
    }
  })
}

/***filter out unnecessary data : keeping login,id and avatar_url
If "login" starts with "a" or "A", add followers_url
***/
function mapReduce(arrayData) {
  return arrayData.map(dataObj => {
    let temp = {}
    if(/^(A|a)/.test(dataObj.login)) {
      temp['followers_url'] = dataObj.followers_url
    }
    temp['login'] = dataObj.login
    temp['id'] = dataObj.id
    temp['avatar_url'] = dataObj.avatar_url
    return temp;
  })
}

app.listen(port, () => console.log(`listening on port ${port}`))
