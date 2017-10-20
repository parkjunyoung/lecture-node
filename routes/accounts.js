var express = require('express');
var router = express.Router();
var passwordHash = require('../libs/passwordHash');
var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('deserializeUser');
    done(null, user);
});

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, 
    function (req, username, password, done) {
        models.Users.findOne({
            where : {
                username : username,
                password : passwordHash(password) ,
            }
        }).then(function(user) {
            if (!user){
                return done(null, false, 
                    { message: '아이디 또는 비밀번호 오류 입니다.' });
            }else{
                return done(null, user.dataValues );
            }
        });
    }
));

router.get('/', function(req , res){
    res.send('accounts app');
});

router.get('/join', function(req, res){
    res.render('accounts/join');
});

router.post( '/join' , ( req,res ) => {
    models.Users.create({
        username : req.body.username,
        password : passwordHash(req.body.password) ,
        displayname : req.body.displayname
    }).then(function() {
        res.send('<script>alert("회원가입 성공");\
        location.href="/accounts/login";</script>');
    });
});
 
router.get('/login', function(req, res){
    res.render('accounts/login', { flashMessage : req.flash().error });
});

router.post('/login' , 
    passport.authenticate('local', { 
        failureRedirect: '/accounts/login', 
        failureFlash: true 
    }), 
    function(req, res){
        res.send('<script>alert("로그인 성공");\
        location.href="/";</script>');
    }
);

router.get('/success', function(req, res){
    res.send(req.user);
});
 
 
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/accounts/login');
});

module.exports = router;