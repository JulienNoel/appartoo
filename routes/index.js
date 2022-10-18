var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');

const userModel = require('../models/user')

/* GET home page. */

router.post('/register', async function(req, res, next) {

let result = true
const userName = req.body.user
const password = req.body.password

const newUser = await userModel({
  token: uid2(32),
  name: userName,
  password: bcrypt.hashSync(password, 10)
})

const userSaved = await newUser.save()

if (!userSaved) {
  result = false
 }
  
  res.json({ result, user: userSaved });
});

router.post('/login', async function(req, res, next) {

  let result = false
  let user = null
  
  const error = []
  const userName = req.body.user
  const password = req.body.password

  const findUser = await userModel.findOne({
    name: userName,
  })

  if (findUser) {
    if (bcrypt.compareSync(password, findUser.password)) {
      result = true
      user = findUser
        
    } else {
      error.push('mot de passe incorrect')
    }

  } else {
    error.push('L\'utilisateur n\'existe pas')
  }
  
  res.json({result, error, user});
});

router.get('/addfriend', async function(req, res, next) {
  

  const friendList = await userModel.find().sort({name: 'asc'})
  const result = friendList.reduce((acc, val) => {
    return [...acc, {name: val.name, img: val.img}]
  },[])  


  res.json({result});
});



module.exports = router;
