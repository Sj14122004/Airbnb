const express = require("express");
const router = express();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      await User.register(newUser, password);
      req.flash("success", "welcome to the Wanderlust");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.render("users/login.ejs");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  wrapAsync(async (req, res) => {
      req.flash("success", "welcome back to the Wanderlust");
      res.redirect("/listings");
  }),
);

module.exports = router;
