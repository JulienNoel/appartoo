var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

const userModel = require("../models/user");

/* GET home page. */

router.post("/register", async function (req, res, next) {
  let result = true;
  const userName = req.body.user;
  const password = req.body.password;

  const newUser = await userModel({
    token: uid2(32),
    name: userName,
    password: bcrypt.hashSync(password, 10),
  });

  const userSaved = await newUser.save();

  if (!userSaved) {
    result = false;
  }

  res.json({ result, user: userSaved });
});

router.post("/login", async function (req, res, next) {
  let result = false;
  let user = null;

  const error = [];
  const userName = req.body.user;
  const password = req.body.password;

  const findUser = await userModel.findOne({
    name: userName,
  });

  if (findUser) {
    if (bcrypt.compareSync(password, findUser.password)) {
      result = true;
      user = findUser;
    } else {
      error.push("mot de passe incorrect");
    }
  } else {
    error.push("L'utilisateur n'existe pas");
  }

  res.json({ result, error, user });
});

router.get("/findfriend/:token", async function (req, res, next) {
  const token = req.params.token;

  const friendList = await userModel.find().sort({ name: "asc" });
  const user = await userModel.findOne({ token: token });
  const maxFriend = friendList
    .filter((el) => el.token !== token)
    .reduce((acc, val) => {
      return [...acc, { name: val.name, img: val.img, token: val.token }];
    }, []);
  const friendFromUser = user?.friend.map(el => el.img)
  const result = maxFriend.filter(el => !friendFromUser.includes(el.img))

  res.json({ result, friend: user.friend });
});

router.post("/updaterole", async function (req, res, next) {
  const token = req.body.token;
  const role = req.body.role;

  await userModel.updateOne(
    {
      token: token,
    },
    { role: role }
  );

  const result = await userModel.findOne({ token: token });

  res.json({ result });
});

router.post("/updatefriend", async function (req, res, next) {
  const token = req.body.token  


  const result = await userModel.findOne({ token: token });
  result.friend.push({name: req.body.name, img: req.body.img})
  const friendUpdate = await result.save()

  res.json({ result: friendUpdate });
});

router.delete("/deletefriend", async function (req, res, next) {
  const token = req.body.token 

  const result = await userModel.findOne({ token: token });
  const friendIndex = result.friend.findIndex(obj => obj.img === req.body.img)
  if (friendIndex >= 0) {
    result.friend.splice(friendIndex,1)
  }
  const friendDelete = await result.save()

  res.json({ result: friendDelete });
});


module.exports = router;
