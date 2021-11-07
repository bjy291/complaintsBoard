var db=require('../../db');

exports.root=function(req,res){ 
    if(req.session.displayname){
            var dname=req.session.displayname;
            res.render('root',{name:dname});
    }else{
            res.render('root'); // 관리자만 접근 가능하도록 
    }
};