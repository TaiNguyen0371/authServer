const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = require("../models/user.model");
const route = new express.Router();

route.post("/signin", (req, res) => {
  const { username, password } = req.body;
  UserSchema.find()
    .then((users) => {
      const user = users.find((user) => user.username === username);
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const accessToken = jwt.sign(
            { fullname: user.fullname },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
          );
          const refreshToken = jwt.sign(
            { fullname: user.fullname },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1h" }
          );
          UserSchema.findOneAndUpdate(
            { username: user.username },
            { refreshToken: refreshToken }
          )
            .then((user) => {
              const returnUser = user.toObject();
              res.status(200).json({
                messgae: "Login successful",
                result: { ...returnUser, accessToken, refreshToken },
              });
            })
            .catch((err) => {
              res.status(403).json();
            });
        } else {
          res.status(403).json({ message: "Password not correct" });
        }
      } else {
        res.status(403).json({ message: "Username not correct" });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});
route.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken) {
    UserSchema.findOne({ refreshToken: refreshToken })
      .then((users) => {
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, data) => {
            if (err) {
              res.status(403);
            } else {
              const accessToken = jwt.sign(
                { username: data.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
              );
              res.status(200).json({ accessToken });
            }
          }
        );
      })
      .catch((err) => {
        res.status(403).json(err);
      });
  } else {
    res.status(401);
  }
});
route.delete("/signout", (req, res) => {
  const refreshToken = req.body.token;
  UserSchema.findOneAndUpdate(
    { refreshToken: refreshToken },
    { refreshToken: null }
  );
  res.status(200).json({ message: "Log out successful" });
});
module.exports = route;
