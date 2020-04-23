var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order =  require('../models/order');


/* GET home page. */
router.get('/', (req, res, next)=>{
    var successMsg = req.flash('success')[0];
  Product.find((err,docs)=>{
    var productChunks = [];
    var chunkSize = 3;
    for(var i = 0; i<docs.length; i+=chunkSize){
        productChunks.push(docs.slice(i,i+chunkSize));
    }
    res.render('shop/index', { title: 'Welcome Shopping' ,products: productChunks, successMsg:successMsg,noMessage: !successMsg});
  });
  
});

router.get('/add-to-cart/:id',(req,res,next)=>{
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId,(err,product)=>{
      if(err){
          return res.redirect('/');
      }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
  });
});

router.get('/shopping-cart',(req,res,next)=>{
    if(!req.session.cart){
        return res.render('shop/cart', {products : null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/cart',{products: cart.genarateArray(),totalPrice: cart.totalPrice, title:'Shopping Cart'});
});

router.get('/checkout',isLoggedIn,(req,res,next)=>{
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg= req.flash('error')[0];
    res.render('shop/checkout',{total: cart.totalPrice, title:'Checkout', errMsg:errMsg});
});

router.post('/checkout',(req,res,next)=>{
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    const stripe = require('stripe')('sk_test_eQVN5udhBvZAoHtVu2oiN9ty00ScmVvnpO');

    stripe.paymentIntents.create({
    amount: cart.totalPrice * 100,
    currency: 'usd',
    description: "Test Charge",
    // Verify your integration in this guide by including this parameter
    metadata: {integration_check: 'accept_a_payment'},
    }, (err, charge)=>{
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart : cart,
            address: req.body.Address,
            paymentId: charge.id
        });
        order.save((err,result)=>{
            req.flash('success', 'Successfull payment');
            req.session.cart = null;
            return res.redirect('/');
        });
        
    });
});
module.exports = router;

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}