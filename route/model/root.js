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