var db=require('../../db');

exports.idcheck=function(req,res){ //아이디중복확인
    var id=req.body.id;
    var sql='select count(*) as result from member where id=?';
    db.query(sql,id,function(err,result){
            if(err) console.log(err);
            else{
                    res.send({"result":result[0].result})
            }
    })
};
exports.regipost=function(req,res){ //회원가입
    var user={
            id:req.body.id,
            pw:req.body.pw,
            name:req.body.name,
            pcode:req.body.pcode,
            pcode2:req.body.pcode2,
            phone:req.body.phone,
            addr:req.body.addr,
            addr2:req.body.addr2,
            email:req.body.email,
            stat: 1
    }
    var sql='insert into member(id,pw,name,pcode, pcode2,phone,addr, addr2,email,stat) values(?,?,?,?,?,?,?,?,?,1)';
    db.query(sql,[user.id,user.pw,user.name,user.pcode,user.pcode2,user.phone,user.addr,user.addr2,user.email,user.stat],function(err,result){
            if(err) console.log(err);
            else{
                    var ok=result.affectedRows;
                    if(ok==1){
                            res.send('<script>alert("회원가입에 성공하셧습니다.");location.href="/login"</script>');
                    }else{
                            res.send('<script>alert("회원가입을 실패하셨습니다.");history.back();</script>',{result:ok});
                    }
            }
    })
};