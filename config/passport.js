var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id, (err,user)=>{
        done(err,user);
    });
});

// customer strategy to sign up 
passport.use('local.signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req,email,password,done)=>{
        req.checkBody('email','Invaid email').notEmpty().isEmail();
        req.checkBody('password','Invaid password').notEmpty().isLength({min:4});
        var errors = req.validationErrors();
        if(errors){
            var messages = [];
            errors.forEach((error=>{
                messages.push(error.msg);
            }));
            return done(null, false, req.flash('error',messages));
        }

    User.findOne({'email':email}, (err,user)=>{
        if(err){
            return done(err);
        }
        if (user){
            return done(null,false, {message: 'Email is alrady in use'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save((err, result)=>{
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

// customer strategy to sign in 
passport.use('local.signin',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},(req,email,password,done)=>{
    req.checkBody('email','Invaid email').notEmpty().isEmail();
    req.checkBody('password','Invaid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach((error=>{
            messages.push(error.msg);
        }));
        return done(null, false, req.flash('error',messages));
    }
    User.findOne({'email':email}, (err,user)=>{
        if(err){
            return done(err);
        }
        if (!user){
            return done(null,false, {message: 'No user in that email'});
        }
        if(!user.vaildPassword(password,user.password)){
            return done(null,false, {message: 'Wrong Password'});
        }
        return done(null,user);
    });
}));