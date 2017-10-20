var express = require('express');
var router = express.Router();

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var models = require('../models');
var dotenv = require('dotenv');
dotenv.config(); // .env 파일에서 설정 가져옴

passport.serializeUser(function (user, done) {
    done(null, user);
});
 
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
        // https://developers.facebook.com에서 appId 및 scretID 발급
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_SECRETCODE,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
    },
    function(accessToken, refreshToken, profile, done) {

        models.Users.findOne({ // 기존에 User모델에 존재하는지 확인
            where : {
                username : "fb_" + profile.id,
             }
        }).then(function(user) {
            if (!user){  //DB에 없으면 회원가입 후 로그인 성공페이지 이동
                models.Users.create({
                    username :  "fb_" + profile.id,
                    password : "facebook_login",
                    displayname : profile.displayName
                }).then(function(result) {
                    done(null,result); //세션 등록
                });
            }else{ //DB에 있으면 가져와서 세션등록
                done(null,user);
            }
        });
        
    }
));

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', 
    passport.authenticate('facebook', { scope: 'email'}) );


//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
   passport.authenticate('facebook', 
       { 
           successRedirect: '/',
           failureRedirect: '/auth/facebook/fail' 
       }
   )
);

//로그인 성공시 이동할 주소
router.get('/facebook/success', function(req,res){
   res.send(req.user);
});

router.get('/facebook/fail', function(req,res){
   res.send('facebook login fail');
});



module.exports = router;