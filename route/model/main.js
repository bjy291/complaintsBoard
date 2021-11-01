var db=require('../../db');
var promise=require('promise');

exports.main=(req,res)=>{
        console.log("get main");
        res.render('main.jade');
}

exports.notice=(req,res)=>{
        console.log("get notice");
        res.render('notice.jade');
}

exports.login=(req,res)=>{
        console.log("get notice");
        res.render('login.jade');
}