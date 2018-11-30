'use strict'
const express = require('express');
const app = express()
const port = process.env.PORT || 3000
const githubUri = 'https://api.github.com'
const axios = require('axios')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/users', getUsers, (req, res) => {
  res.send(res.filteredData);
})
app.get('/users/:id/followers', getUsers, (req, res) => {
  res.send(res.filteredData);
})


/***GET users depends on the container size
  req.query.counts contains number of avatars the current viewport row container can hold
 ***/
function getUsers(req, res, next) {
  let counter = req.query.counts;
  if(counter)
    return getMaxNumOfAvatarsPerPage(req, res, counter,1000, next)
  else
    return getFollowersOfAUser(req, res, next)
}


function getMaxNumOfAvatarsPerPage(req, res, count,last, next) {
  let counter = count;
  if(counter <= 0) {
    return next();
  }
  let lastId = last
  let url = `${githubUri}/users?since=${lastId}&per_page=${counter}`
  return axios.get(url)
  .then((response) => {
    lastId += response.data.length
    counter -= response.data.length
    res.filteredData = res.filteredData ? res.filteredData.concat(mapReduce(response.data)) : mapReduce(response.data)
    getMaxNumOfAvatarsPerPage(req, res, counter,lastId, next);
  })
  .catch((err) => {
    if(err) {
      res.error = err

      console.log('err ' + res.error);
      next(err);
    }
  })
}

function getFollowersOfAUser(req, res, next) {
  let url =`${githubUri}/users/${req.params.id}/followers`
  axios.get(url)
  .then((response) => {
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
