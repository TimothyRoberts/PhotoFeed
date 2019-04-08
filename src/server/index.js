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

// token authentication
// string to use when signing the tokens (shouldn't be hardcoded)
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

// Checks token for user
server.get("/api/checkToken", withAuth, function(req, res) {
  res.sendStatus(200);
});

// Removes user token
server.get("/api/logout", withAuth, function(req, res) {
  res.cookie("token", "", { httpOnly: true }).sendStatus(200);
});

// ------------------------------------
// USER REQUESTS
// ------------------------------------

// retrieve all image uploads from DB
server.get("/api/uploads", (req, res) => {
  Upload.find({}, (err, result) => {
    if (err) throw err;

    res.send(result);
  });
});

// retrieve uploads with from specific user
server.get("/api/uploads/:id", (req, res) => {
  Upload.find({ userId: req.params.id }, (err, result) => {
    if (err) throw err;

    console.log(result);
    res.send(result);
  });
});

// Deletes user with specific id
server.delete("/api/uploads/:id", (req, res) => {
  Upload.deleteOne({ _id: new ObjectID(req.params.id) }, err => {
    if (err) return res.send(err);
    return res.send({ success: true });
  });
});

// Creates new image
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

// Updates user with info in request body
server.put("/api/uploads", (req, res) => {
  // get the id of the image to be updated
  const id = req.body._id;
  // remove the id to avoid overwriting it when updating
  delete req.body._id;
  // find an image matching this id and update their details
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
