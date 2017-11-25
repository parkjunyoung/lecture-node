var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/' , function(req, res){
    
    var totalAmount = 0; //총결제금액
    var cartList = {}; //장바구니 리스트
    //쿠키가 있는지 확인해서 뷰로 넘겨준다
    if( typeof(req.cookies.cartList) !== 'undefined'){
        //장바구니데이터
        var cartList = JSON.parse(unescape(req.cookies.cartList));

        //총가격을 더해서 전달해준다.
        for( let key in cartList){
            totalAmount += parseInt(cartList[key].amount);
        }
    }
    res.render('checkout/index', { cartList : cartList , totalAmount : totalAmount } );
});

router.post('/complete', (req,res)=>{
    models.Checkout.create({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
        
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,

        status : req.body.status,

    }).then(function() {
        res.json({ message : "success" });
    });
});


router.post('/mobile_complete', (req,res)=>{
    models.Checkout.create({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
        
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,

        status : req.body.status,

    }).then(function() {
        res.redirect('/');
    });
});

router.get('/success', function(req,res){
    res.render('checkout/success');
});

router.get('/nomember', function(req,res){
    res.render('checkout/nomember');
});

router.get('/nomember/search', function(req,res){

    models.Checkout.findAll( {where : { buyer_email : req.query.email } } ).then( function(checkoutList){
        res.render('checkout/search', { checkoutList : checkoutList } ); 
    });

});

module.exports = router;