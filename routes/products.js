var router = require('express').Router();
var models = require('../models');

router.get('/:id' , function(req, res){
    models.Products.findById(req.params.id).then( function(product){
        res.render('products/detail', { product: product });  
    });
});

module.exports = router;