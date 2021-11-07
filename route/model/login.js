var db=require('../../db');

exports.loginget=function(req,res){ //로그인페이지
        if(req.session.displayname){
                var dname=req.session.displayname;
                res.render('login',{name:dname});
        }else{
                res.render('login');
        }
};
exports.loginpost=function(req,res){ //로그인
    var user={
            id:req.body.id,
            pw:req.body.pw
    }
    var sql='select count(*) as ok,name from member where id=? and pw=?';
            db.query(sql,[user.id,user.pw],function(err,result){
            if(err) console.log(err);
            else{
                    var ok=result[0].ok;
                    if(ok==1){
                            req.session.displayname=result[0].name;
                            req.session.user=user.id;
                            req.session.save(function(){
                                    console.log('로그인완료 ' + req.session.displayname)
                                    res.redirect('/');
                            })
                    }else{
                            res.send('<script>alert("아이디나 비밀번호가 일치하지 않습니다");location.href="/login"</script>');
                    }
            }
            })
};
exports.logout=function(req,res){ //로그아웃
    delete req.session.displayname;
    req.session.save(function(){
            res.redirect('/');
    })
};