const db = require("../models");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt");
const expressSanitizer = require("express-sanitizer");
const verifyUser = require("../helpers/verify");

////////////////////GHENI'S///////////////////////////////////////////////

module.exports = {
  /////////////////////////////////////CREATING A NEW UESR AND POSTING TO DB/////////////////////////////
  createUser: function(newUser, returnToRoute) {
    db.User.create(newUser, function(err, user, next) {
      returnToRoute(err, user);
    });
  },
  createBooking: function(id, booking) {
    // console.log(id);
    // console.log(booking);
    db.User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          booking: booking
        }
      },
      { new: true }
    )
      .then(dbModel => console.log("db model: ", dbModel))
      .catch(err => console.log(err));
  },

  getBooking: function(id, res) {
    console.log("get booking id:", id);
    db.User.findById({ _id: id })
      .then(dbModel => res.send(dbModel[0].booking[0]))
      .catch(err => res.status(422).json(err));
  },
  ////////////////////////////LOGIN CONTROLLER/////////////////////////////////////////////////////
  userLogin: async function(req, res, next) {
    const {
      //// SAME THING FOR THIS AS PREVIOUS MIGHT NEED HELPER BUT SOME DEF IN CONTROLLER LINES 95-109
      email,
      password
    } = req.body;
    try {
      const isValidObject = await verifyUser(email, password, next);
      if (!isValidObject.isValid)
        throw new Error("The username or password you entered is incorrect.");
      req.session.user = isValidObject.user;
      res.redirect("/profile");
    } catch (error) {
      error.message = "The username or password you entered is incorrect.";
      res.render("login", {
        error
      });
    } /// LINE 109
  },
  /////////////////////////////////////////lOADING USER PROFILE//////////////////////
  userProfile: function(req, res) {
    const {
      //// THIS PART WILL PROBABLY BE CONTROLLER FROM LINE 85-90 (WE MAY NEED TO DO UTIL HELPER)
      user
    } = req.session;
    res.render("profile", {
      user
    }); ///// LINE 90
  }
};

//////////////////////////////////////////////////////////////////
