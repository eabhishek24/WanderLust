const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");



router.get("/signup", (req,res)=>{
    res.render("user/signup");
});

router.post("/signup", wrapAsync (async (req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","user registered");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));


router.get("/login",(req,res)=>{
    res.render("user/login");
});

router.post("/login", saveRedirectUrl ,passport.authenticate("local" , {failureRedirect: "/login", failureFlash: true}) , async (req,res)=>{
   req.flash("success", "Welcome back to WanderLust");
   
   res.redirect(res.locals.redirectUrl || "/listings");   
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
});

module.exports = router;