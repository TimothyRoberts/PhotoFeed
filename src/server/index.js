const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const server = express();

const User = require("./models/User");
const withAuth = require("./middleware");
const Upload = require("./models/Upload");

const secret = "secret_should_not_be_in_git";

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookieParser());

const mongo_uri = "mongodb://localhost/react-auth";
mongoose.connect(
  mongo_uri,
  { useNewUrlParser: true },
  function(err) {
    if (err) {
      throw err;
    } else {
      console.log(`Successfully connected to ${mongo_uri}`);
    }
  }
);

server.use(express.static(path.join(__dirname, "public")));

server.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------------------------
// AUTHENTICATION REQUESTS
// ------------------------------------

server.post("/api/register", function(req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});

// checks email and password against everything in db
server.post("/api/authenticate", function(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again"
      });
    } else if (!user) {
      res.status(401).json({
        error: "Incorrect email or password"
      });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500).json({
            error: "Internal error please try again"
          });
        } else if (!same) {
          res.status(401).json({
            error: "Incorrect email or password"
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: "1h"
          });
          res.cookie("token", token, { httpOnly: true });
          res.send(user);
        }
      });
    }
  });
});

server.get("/api/checkToken", withAuth, function(req, res) {
  res.sendStatus(200);
});

server.get("/api/logout", withAuth, function(req, res) {
  res.cookie("token", "", { httpOnly: true }).sendStatus(200);
});

// ------------------------------------
// USER REQUESTS
// ------------------------------------

// retrieve all user objects from DB
server.get("/api/uploads", (req, res) => {
  Upload.find({}, (err, result) => {
    if (err) throw err;

    // console.log(result);
    res.send(result);
  });
});

// retrieve user with specific ID from DB
server.get("/api/uploads/:id", (req, res) => {
  Upload.find({ userId: req.params.id }, (err, result) => {
    if (err) throw err;

    console.log(result);
    res.send(result);
  });

  // User.findOne({_id: req.params.id}, function(err, data) {
  //   if (err) throw err;
  //
  //   Upload.find({userId: userId._id}, function(err, modules) {
  //     if (err) throw err;
  //
  //     res.send(modules);
  //   });
  // });

});

// delete user with specific ID from DB
server.delete("/api/uploads/:id", (req, res) => {
  Upload.deleteOne({ _id: new ObjectID(req.params.id) }, err => {
    if (err) return res.send(err);
    return res.send({ success: true });
  });
});

// create new user based on info supplied in request body
server.post("/api/uploads", (req, res) => {
  const image = new Upload(req.body);
  console.log(image);
  // image.userId = new ObjectID(image.userId);
  // console.log(image);
  image.save((err, result) => {
    if (err) throw err;
    return res.send({ success: true });
    console.log("created in database");
  });
});

// update user based on info supplied in request body
server.put("/api/uploads", (req, res) => {
  // get the ID of the user to be updated
  const id = req.body._id;
  // console.log(req.body);
  // remove the ID so as not to overwrite it when updating
  delete req.body._id;
  // find a user matching this ID and update their details
  Upload.updateOne(
    { _id: new ObjectID(id) },
    { $set: req.body },
    (err, result) => {
      if (err) throw err;

      console.log("updated in database");
      return res.send({ success: true });
    }
  );
});

server.listen(process.env.PORT || 8080);
