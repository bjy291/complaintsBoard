var db=require('../../db');

exports.root=function(req,res){ 
    if(req.session.displayname){
            var dname=req.session.displayname;
            res.render('root',{name:dname});
    }else{
            res.render('root'); // 관리자만 접근 가능하도록 
    }
};

exports.rootpost=function(req,res){
        var sql='select * from min_board';
        db.query(sql, function(err, result){
                if(err) console.log(err)
                else{
                        
                        res.send({"data":result})   
                }
        })
}