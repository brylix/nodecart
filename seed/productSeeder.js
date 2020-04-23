var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping?readPreference=primary&appname=MongoDB%20Compass&ssl=false',{useUnifiedTopology: true,useNewUrlParser: true});

var products = [
    new Product({
        imagePath: 'https://supermarkets.lk/img/182620-img.jpg',
        title: 'Ezy Pants Diaper Jumbo 2 Packs - S',
        description: 'The Velona Cuddles Ezy pant was designed as a convenient diaper option for dressing active kids. The 360° stretch elastic band makes it very easy to put on, while the easy tear sides, make removal very simple.',
        price: 1740
    }),
    new Product({
        imagePath: 'https://supermarkets.lk/img/110859-img.jpg',
        title: 'Ezy Pants Diaper Jumbo 2 Packs - M',
        description: 'The Velona Cuddles Ezy pant was designed as a convenient diaper option for dressing active kids. The 360° stretch elastic band makes it very easy to put on, while the easy tear sides, make removal very simple.',
        price: 1890
    }),
    new Product({
        imagePath: 'https://supermarkets.lk/img/111246-img.jpg',
        title: 'Ezy Pants Diaper Jumbo 2 Packs - L',
        description: 'The Velona Cuddles Ezy pant was designed as a convenient diaper option for dressing active kids. The 360° stretch elastic band makes it very easy to put on, while the easy tear sides, make removal very simple.',
        price: 1900
    }),
    new Product({
        imagePath: 'https://supermarkets.lk/img/184032-img.jpg',
        title: 'Classic Diaper Jumbo 2 Packs - NB',
        description: 'As a new parent, nothing is more important than keeping your baby safe & protected. We at Velona understand that, and have made it our mission to produce a range of diapers that provide the highest quality and safest materials.',
        price: 2100
    }),
    new Product({
        imagePath: 'https://supermarkets.lk/img/183015-img.jpg',
        title: 'Ezy Pants Diaper Jumbo 2 Packs - XL',
        description: 'As a new parent, nothing is more important than keeping your baby safe & protected. We at Velona understand that, and have made it our mission to produce a range of diapers that provide the highest quality and safest materials.',
        price: 2100
    })
];

var done = 0;
for(var i = 0; i < products.length; i++){
    products[i].save((err,result)=>{
        done++;
        if(done==products.length){
            didEx();
        }
    });
}


function didEx(){
    mongoose.disconnect();
}
