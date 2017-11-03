var express = require('express');
var router = express.Router();
var models = require('../models');
var loginRequired = require('../libs/loginRequired');

// csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' ); // 루트의 uploads위치에 저장한다.
var fs = require('fs');

//multer 셋팅
var multer  = require('multer');
var storage = multer.diskStorage({
    destination : function (req, file, callback) { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir );
    },
    filename : function (req, file, callback) { // products-날짜.jpg(png) 저장 
        callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage: storage });

router.get( '/' , function(req,res){
    res.send('admin app');
});

router.get( '/products' , function(req,res){
    models.Products.findAll({

    }).then(function(products) {
        res.render( 'admin/products' ,{ products : products });
    });
});

router.get('/products/write', loginRequired, csrfProtection, function(req,res){
    res.render( 'admin/form', { product : "", csrfToken : req.csrfToken()  } );
});

router.post('/products/write', loginRequired, upload.single('thumbnail'), csrfProtection, function(req,res){
    models.Products.create({
        product_name : req.body.product_name,
        thumbnail : (req.file) ? req.file.filename : "",
        price : req.body.price ,
        sale_price : req.body.sale_price ,
        description : req.body.description
    }).then(function() {
        res.redirect('/admin/products');
    });
});

router.get('/products/detail/:id' , function(req, res){
    models.Products.findById(req.params.id).then( function(product){
        res.render('admin/productsDetail', { product: product });  
    });
});

router.get('/products/edit/:id' ,loginRequired, csrfProtection, function(req, res){
    models.Products.findById(req.params.id).then( function(product){
        res.render('admin/form', { product : product, csrfToken : req.csrfToken() });
    });
});


router.post('/products/edit/:id' ,loginRequired, upload.single('thumbnail') , csrfProtection, function(req, res){
    models.Products.findById(req.params.id).then( (product) => {

        if( product.thumbnail && req.file){  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + product.thumbnail );
        }

        models.Products.update(
            {
                product_name : req.body.product_name,
                thumbnail : (req.file) ? req.file.filename : product.thumbnail ,
                price : req.body.price ,
                sale_price : req.body.sale_price ,
                description : req.body.description
            }, 
            { 
                where : { id: req.params.id } 
            }
        ).then(function() {
            res.redirect('/admin/products/detail/' + req.params.id );
        });
    });   
});


router.get('/products/delete/:id', function(req, res){
    models.Products.destroy({
        where: {
            id: req.params.id
        }
    }).then(function() {
        res.redirect('/admin/products');
    });
});

router.post('/products/ajax_summernote', loginRequired, upload.single('thumbnail'), function(req,res){
    res.send( '/uploads/' + req.file.filename);
});

module.exports = router;