const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signup");
};

module.exports.signup = async (req,res)=>{
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
};

module.exports.loginRender = (req,res)=>{
    res.render("user/login");
};

module.exports.login = async (req,res)=>{
    req.flash("success", "Welcome back to WanderLust");
    res.redirect(res.locals.redirectUrl || "/listings");   
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
};
