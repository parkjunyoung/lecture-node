var express = require('express');
var router = express.Router();
var models = require('../models');

router.get( '/' , function(req,res){
    models.Products.findAll({

    }).then(function(products) {
        res.render( 'home' ,{ products : products });
    });
});

module.exports = router;