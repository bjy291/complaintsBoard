var db=require('../../db');
var promise=require('promise');

exports.main=(req,res)=>{
        var sql="select * from min_board order by mb_no desc";
        db.query(sql, function(err, result){
                if(err) console.log(err);
                else{
                        
                        if(req.session.displayname){
                                var dname=req.session.displayname;
                                res.render('main',{name:dname,id:req.session.user,result:result});  
                        }else{
                                res.render('main',{name:dname,id:req.session.user,result:result});
                        }   
                }
        })
}

exports.notice=(req,res)=>{
        console.log("get notice");
        if(req.session.displayname){
                var dname=req.session.displayname;
                res.render('notice',{name:dname});
        }else{
                res.render('notice');
        }
}

exports.minboard=(req,res)=>{
        var maxpost=10; //페이지당 상품수
        var pno=req.query.page; //페이지넘버
        var val=req.query.val;

        var query=req.query;
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        if(val){
                sql = sql + " where title like '%" + val + "%'";
        }
        var sql="select count(*) as postcnt from min_board";

        db.query(sql, function(err, result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql='select * from min_board';
                        if(val){
                                sql = sql + " where title like '%" + val + "%'";
                        }sql = sql + " order by mb_no desc limit ?, ?";
                        db.query(sql, [start, maxpost], function(err, result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                        } 
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('minboard',{name:dname,id:req.session.user,result:result,pager:pager,pno:pno,query:query});  
                                        }else{
                                                res.render('minboard',{result:result,pager:pager,pno:pno,query:query});
                                        }   
                                }
                        })
                }
        })
}

exports.minboard_get=(req,res)=>{
        var pno=req.query.num; 

        var updatesql = 'update min_board set b_inquiry = b_inquiry + 1 where mb_no = ?'
        db.query(updatesql, pno);
        var sql="select * from min_board where mb_no = ?";
        console.log(pno)
        db.query(sql,pno, function(err, result){
                if(err) console.log(err);
                else{
                        var sql='SELECT A.id AS writer_id, A.mb_writer AS writer_name, B.* FROM min_board A, com_min_board B WHERE A.mb_no = B.mb_no AND B.mb_no = ?';
                        db.query(sql, pno ,function(err, comment){
                                if(err) console.log('게시글 댓글 : '+ err);
                                else{
                                        if(req.session.displayname){
                                                var dname = req.session.displayname;    
                                                console.log(result[0]);
                                                res.render('minboard_get', {name:dname, id:req.session.user, mbo: result[0], comment:comment, mb_no:result[0].num});
                                        }else{
                                                res.render('minboard_get',{err:err});
                                        }
                                }
                        });
                }
        });
}

exports.minboard_write=(req, res) =>{
        if(req.session.displayname){
                var dname=req.session.displayname;
                res.render('minboard_write',{name:dname,id:req.session.user});
        }else{
                res.render('minboard_write');
        }
}

exports.minboard_writepost=(req, res) =>{
        var minboard={
                title:req.body.title,
                writer:req.body.writer,
                select:req.body.select,
                contents:req.body.contents,
                id:req.body.id
        }
        //console.log(minboard.id)
        var sql = 'insert into min_board(id, mb_writer, mb_title, mb_content, mb_cate, mb_sub_cate, b_inquiry, b_status) values(?, ?, ?, ?, "민원", ? ,0 ,0)'
        db.query(sql, [minboard.id, minboard.writer, minboard.title, minboard.contents, minboard.select], function(err, result){
                if(err) console.log(err)
                else{
                        var ok=result.affectedRows;
                        if(ok==1){
                                res.send(true);
                        }else{
                                res.send(false);
                        }
                }
        })
}       

exports.minboard_commentpost=(req, res) =>{
        var comment={
                comment_mb_no:req.body.comment_mb_no,
                comment_content:req.body.comment_content,
                comment_writer:req.body.comment_writer
        }
        console.log("a : " + comment.comment_mb_no)
        var sql = 'insert into com_min_board(mb_no, com_mb_writer, com_mb_content) values(?, ?, ?)'
        db.query(sql, [comment.comment_mb_no, comment.comment_writer, comment.comment_content], function(err, result){
                if(err) console.log(err)
                else{
                        var ok=result.affectedRows;
                        if(ok==1){
                                res.send(true);
                        }else{
                                res.send(false);
                        }
                }
        })
}       


