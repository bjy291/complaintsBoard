const { request } = require('express');
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
        var mb_sub_cate = req.body.mb_sub_cate
        var min_date = req.body.min_date
        var max_date = req.body.max_date

        var sql='select mb_no, mb_writer, mb_title, mb_content, mb_date, mb_cate, mb_sub_cate, b_inquiry, if(b_status = 0, "미처리",if(b_status = 1, "처리완료","에러")) as b_status from min_board where mb_cate = "민원"';
        if(mb_sub_cate == '전체'){
                sql += ' and mb_date between ? and ? order by mb_no desc'
                db.query(sql, [min_date, max_date], function(err, result){
                        if(err) console.log(err)
                        else{
                                res.send({"data":result, "records" : result.length})   
                        }
                })
        }else{
                console.log(mb_sub_cate)
                sql += ' and mb_sub_cate = ? and mb_date between ? and ? order by mb_no desc'
                db.query(sql, [mb_sub_cate, min_date, max_date], function(err, result){
                        if(err) console.log(err)
                        else{
                                res.send({"data":result, "records" : result.length})   
                        }
                })
        }
}

exports.min_boardClick=function(req,res){ 
        var minboardC={
                mb_no:req.body.mb_no,
        }
        sql = 'select mb_title, mb_content from min_board where mb_cate = "민원" and mb_no = ?'

        db.query(sql, [minboardC.mb_no], function(err, result){
                if(err) console.log(err)
                else{
                        sql='select min_Cno, mb_no, title as complaints_title, contents as complaints_content, ex_date as complaints_complete, date from min_Complaint where mb_no = ?'
                        db.query(sql, [minboardC.mb_no], function(err, result2){
                               if(err) console.log(err);
                               else{
                                       res.send({"data":result[0], "data2":result2});  
                               }
                        })
                }
        })
    };

exports.insert_minComplaints=function(req,res){ 
        var mb_sub_cate = req.body.mb_sub_cate
        var min_date = req.body.min_date
        var max_date = req.body.max_date

        var c_rownum = req.body.c_rownum;
        var u_rownum = req.body.u_rownum;

        let createdRows =  req.body.createdRows;
        var updatedRows = req.body.updatedRows;

        var mb_no = req.body.mb_no;

        console.log(createdRows)

        if(c_rownum > 0){
                for(var i=0; i<c_rownum; i++) {
                        //createdRows[i]['complaints_title']
                        sql = 'insert into min_Complaint(mb_no, title, contents, ex_date) value(? ,? ,?, ?)';
                        db.query(sql, [mb_no, createdRows[i]['complaints_title'], createdRows[i]['complaints_content'], createdRows[i]['complaints_complete']], function(err, result){
                                if(err) console.log(err);
                                else{
                                        var update_status = 'update min_board set b_status = 1 where mb_no = ?'
                                        db.query(update_status, [mb_no]);

                                        var sql='select mb_no, mb_writer, mb_title, mb_content, mb_date, mb_cate, mb_sub_cate, b_inquiry, if(b_status = 0, "미처리",if(b_status = 1, "처리완료","에러")) as b_status from min_board where mb_cate = "민원"';
                                        if(mb_sub_cate == '전체'){
                                                sql += ' and mb_date between ? and ? order by mb_no desc'
                                                db.query(sql, [min_date, max_date], function(err, result){
                                                        if(err) console.log(err)
                                                        else{
                                                                //res.send({"data":result, "records" : result.length})
                                                                var sql2 = 'select min_Cno, mb_no, title as complaints_title, contents as complaints_content, ex_date as complaints_complete, date from min_Complaint where mb_no = ?'
                                                                db.query(sql2, [mb_no], function(err, result2){
                                                                        if(err) console.log(err);
                                                                        else{
                                                                                res.send({"data":result, "records" : result.length, "data2":result2, "records2": result2.length})
                                                                        }
                                                                })   
                                                        }
                                                })
                                        }else{
                                                sql += ' and mb_sub_cate = ? and mb_date between ? and ? order by mb_no desc'
                                                db.query(sql, [mb_sub_cate, min_date, max_date], function(err, result){
                                                        if(err) console.log(err)
                                                        else{
                                                                var sql2 = 'select min_Cno, mb_no, title as complaints_title, contents as complaints_content, ex_date as complaints_complete, date from min_Complaint where mb_no = ?'
                                                                db.query(sql2, [mb_no], function(err, result2){
                                                                        if(err) console.log(err);
                                                                        else{
                                                                                res.send({"data":result, "records" : result.length, "data2":result2, "records2": result2.length})
                                                                        }
                                                                })
                                                        }
                                                })
                                        }
                                }
                        })
                }
        }
};    

exports.delete_minComplaints=function(req, res){
        var Cdelete= {
                mb_no : req.body.mb_no,
                min_Cno: req.body.min_Cno
        }

        sql='delete from min_Complaint where mb_no = ? and min_Cno = ?'
        db.query(sql,[Cdelete.mb_no, Cdelete.min_Cno], function(err, result){
                if(err) console.log(err)
                else{
                        selectsql='select min_Cno, mb_no, title as complaints_title, contents as complaints_content, ex_date as complaints_complete, date from min_Complaint where mb_no = ?'
                        db.query(selectsql, [Cdelete.mb_no], function(err, result2){
                                if(err) console.log(err);
                                else{
                                        res.send({"data":result2, "records": result2.length})
                                }
                        })
                }
        })
}

exports.chart1=function(req,res){ 
        var date = new Date();
        var month = date.getMonth()
        var year = date.getFullYear();
        console.log(month)
        var sql = "SELECT date_format(mb_date,'%m') as month, date_format(mb_date,'%d') as day FROM min_board WHERE mb_date like CONCAT('%',?-?,'%')"

        db.query(sql,[ year,month],function(err, result){
                if(err) console.log(err)
                else{
                        sql = "SELECT  date_format(mb_date,'%d') as day, COUNT(*) as cnt FROM min_board WHERE mb_date like CONCAT('%',?-?,'%') GROUP BY 1"
                        db.query(sql,[ year,month], function(err, result2){
                                if(err) console.log("chart sql 2 err : " + err);
                                else{
                                        if(req.session.displayname){
                                                var dname = req.session.displayname;  
                                                var DayList = [];
                                                for (day of result2){
                                                        DayList.push(day.day);
                                                }

                                                var CntList = [];
                                                for (cnt of result2){
                                                        CntList.push(cnt.cnt)
                                                }
                                                console.log(DayList[0]);
                                                res.render('chart1', {name:dname, id:req.session.user, chartDAY: DayList, chartCNT:CntList});
                                        }else{
                                                res.render('chart1');
                                        }   
                                }
                        }) 
                        
                }
        })
    };

exports.chartMonth=function(req, res){
        var date = new Date();
        var month = req.body.month;
        var year = date.getFullYear();

        sql = 'SELECT  date_format(mb_date,"%d") as day, COUNT(*) as cnt FROM min_board WHERE mb_date like CONCAT("%","'
        sql += year+'-'+month
        sql += '","%") GROUP BY 1'

        db.query(sql, function(err, result2){
                                if(err) console.log("chart post err : " + err);
                                else{
                                        sql2='SELECT A.day, ifnull(B.cnt, 0) as cnt FROM (SELECT  date_format(mb_date,"%d") as day, COUNT(*) as cnt FROM min_board WHERE mb_date LIKE CONCAT("%","'
                                        sql2+=year+'-'+month
                                        sql2+='","%") GROUP BY 1) A LEFT OUTER JOIN (SELECT  date_format(mb_date,"%d") as day, COUNT(*) as cnt FROM min_board A, (SELECT mb_no FROM min_Complaint GROUP BY 1) B WHERE mb_date like CONCAT("%","'
                                        sql2+=year+'-'+month
                                        sql2+='","%") AND A.mb_no = B.mb_no GROUP BY 1) B ON A.day = B.day'
                                        db.query(sql2, function(err, result3){
                                                if(err) console.log(err)
                                                else{
                                                        var DayList = [];
                                                        for (day of result2){
                                                                DayList.push(day.day);
                                                        }

                                                        var CntList = [];
                                                        for (cnt of result2){
                                                                CntList.push(cnt.cnt)
                                                        }

                                                        var DayList2 = [];
                                                        for (day of result3){
                                                                DayList2.push(day.day);
                                                        }

                                                        var CntList2 = [];
                                                        for (cnt of result3){
                                                                CntList2.push(cnt.cnt)
                                                        }
                                                        console.log(CntList2);
                                                        res.send({"chartDAY": DayList, "chartCNT":CntList, "records": result2.length, "chartDAY2": DayList2, "chartCNT2":CntList2})
                                                }
                                        })
                                }
                        }) 
}


exports.calender=function(req,res){ 
        if(req.session.displayname){
                var dname=req.session.displayname;
                res.render('calender',{name:dname});
        }else{
                res.render('calender'); 
        }
    };