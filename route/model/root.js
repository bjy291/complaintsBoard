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
        var mb_cate = req.body.mb_cate
        var min_date = req.body.min_date
        var max_date = req.body.max_date

        var sql='select mb_no, mb_writer, mb_title, mb_content, mb_date, mb_cate, mb_sub_cate, b_inquiry, if(b_status = 0, "미처리",if(b_status = 1, "처리완료","에러")) as b_status from min_board where mb_cate = ?';
        sql += ' and mb_date between ? and ? order by mb_no desc'
        db.query(sql, [mb_cate, min_date, max_date], function(err, result){
                if(err) console.log(err)
                else{
                        res.send({"data":result, "records" : result.length})   
                }
        })
}

exports.min_boardClick=function(req,res){ 
        var minboardC={
                mb_no:req.body.mb_no,
                mb_cate:req.body.mb_cate
        }
        console.log(minboardC.mb_cate + minboardC.mb_no)
        sql = 'select mb_title, mb_content from min_board where mb_cate = ? and mb_no = ?'
        db.query(sql, [minboardC.mb_cate, minboardC.mb_no], function(err, result){
                if(err) console.log(err)
                else{
                        res.send({"data":result[0]})   
                }
        })
    };

exports.insert_minComplaints=function(req,res){ 
        console.log('insert_minComplaints')
        var c_rownum = req.body.c_rownum;
        var u_rownum = req.body.u_rownum;

        let createdRows =  req.body.createdRows;
        var updatedRows = req.body.updatedRows;

        var mb_no = req.body.mb_no;

        console.log(createdRows)

        if(c_rownum > 0){
                // for(var i=0; i<c_rownum; i++) {
                //         Integer.parseInt(i)
                //         console.log(createdRows[][complaints_title])
                // }
        }
};    

exports.chart1=function(req,res){ 
        var date = new Date();
        var month = date.getMonth()+1
        var sql = "SELECT date_format(mb_date,'%m') as month, date_format(mb_date,'%d') as day FROM min_board WHERE mb_date BETWEEN '2021-?-01' AND '2021-?-30';"

        db.query(sql,[month, month],function(err, result){
                if(err) console.log(err)
                else{
                        sql = "SELECT  date_format(mb_date,'%d') as day, COUNT(*) as cnt FROM min_board WHERE mb_date BETWEEN '2021-?-01' AND '2021-?-30' GROUP BY 1"
                        db.query(sql,[month, month], function(err, result2){
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