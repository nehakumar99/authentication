//jshint esversion:6

//set-up stage 1
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const encrypt = require("mongoose-encryption");
//API
console.log(process.env.API_KEY);
//set-up stage 2
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
//schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//mongoose-encrypt

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });


const User = mongoose.model("User", userSchema);
app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req ,res){
  const inputEmail = req.body.username;
  const inputPassword = req.body.password;
  User.findOne({email: inputEmail }, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === inputPassword){
          res.render("secrets");
        }
      }
    }
  });
});
app.listen(3000, function(){
  console.log("Server running on port 3000");
});
