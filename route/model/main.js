var db=require('../../db');
var promise=require('promise');

exports.main=(req,res)=>{
        console.log("get main");
        res.render('board.jade');
}