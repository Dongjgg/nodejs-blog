
var Article = require("../models/article");
var db = require("../models/mysql");
var moment = require('moment');


//添加文章
exports.addArticle = function(title,content,brief,tagid,callback){

    // 创建一个新的记录
    var newRecord = {};
    // 将title、content、pubtime、date、brief、tag_id添加到新的记录中
    newRecord.title = title;
    newRecord.content = content;
    newRecord.pubtime = moment().format('YYYY-MM-DD HH:mm:ss');
    newRecord.date = moment().format('YYYY年MM月');
    newRecord.brief = brief;
    newRecord.tag_id = tagid;
    // 创建新的记录，并将新的记录添加到Article表中
    Article.create(newRecord, function(err, results) {

        // 返回添加成功的结果
        return callback(err,results);
    });
};

//文章列表
exports.articleList = function(pageSize,pageNow,callback){

    //计算偏移量
    var offset = pageSize * (pageNow - 1);

    //查询文章
    Article.find().limit(pageSize).offset(offset).order('-pubtime').all(function(err,articles){

        //回调函数
        return callback(err,articles);
    });
};
//文章列表
exports.articleSearchList = function(param,callback){

    //获取页面大小
    var pageSize = param.pageSize;
    //获取当前页码
    var pageNow = param.pageNow;
    //获取标签id
    var tagid = param.tagid;
    //获取日期
    var date = param.date;
    //获取关键字
    var key = param.key;
    //计算偏移量
    var offset = pageSize * (pageNow - 1);
    //拼接SQL语句
    var sql = "SELECT t1.*,t2.logo FROM article as t1 LEFT JOIN tags as t2 on t1.tag_id = t2.id WHERE 1=1 ";
    //如果有关键字
    if(key)
    {
        //拼接SQL语句
        sql +=" AND t1.title like '%"+key+"%'";
    }
    //如果有标签id
    if(tagid)
    {
        //拼接SQL语句
        sql +=" AND t1.tag_id = "+tagid;
    }
    //如果有日期
    if(date)
    {
        //拼接SQL语句
        sql +=" AND t1.date = '"+date+"'";
    }
    //拼接SQL语句
    sql +=" order by t1.pubtime desc";
    //拼接SQL语句
    sql += " LIMIT "+offset+","+pageSize+"";
    //执行SQL语句
    db.driver.execQuery(sql,function(err,articles){

        //打印错误信息
        console.log(err);
        //返回错误信息和文章列表
        return callback(err,articles);
    });
};
//文章总记录数
exports.articleCount = function(callback){

    Article.count(function(err,count){

        return callback(err,count);
    });
};
//根据id查询文章
exports.articleById = function(id,callback){

    Article.find({id:id},function(err,article){

        return callback(err,article);
    });
};
//更新文章
exports.articleUpdate = function(id,title,content,brief,tagid,callback){

    Article.find({id:id},function(err,article){

        article[0].title = title;
        article[0].content = content;
        article[0].brief = brief;
        article[0].tag_id = tagid;
        article[0].save(function(err,result){

            return callback(err,result);
        });
    });
};
//最新文章  按时间排序  5篇文章
exports.articleNew = function(callback){

    Article.find().limit(5).order('-pubtime').all(function(err,articles){

            return callback(err,articles);
    });
};
//文章分类数统计
exports.articleTagCount = function(callback){

     db.driver.execQuery(

     "SELECT t2.tagname,t2.id,count(*) as nums FROM article as t1 left join tags as t2 on t1.tag_id = t2.id GROUP BY t1.tag_id",

        function (err, data) {

            return callback(err,data);

         });
};
//文章存档统计
exports.articleArchives = function(callback){


    Article.aggregate(['date'],{}).count().groupBy('date').get(function (err, data) {

        return callback(err,data);
    });
};
//更新文章的浏览数数
exports.articleViewsUpdate = function(id,callback){

    Article.find({id:id},function(err,article){

        article[0].hits = parseInt(article[0].hits +1);
        article[0].save(function(err,result){

            return callback(err,result);
        });
    });
};
//更新文章的点赞数
exports.articleGoodUpdate = function(id,callback){

    Article.find({id:id},function(err,article){

        article[0].good = parseInt(article[0].good +1);
        article[0].save(function(err,result){

            return callback(err,result);
        });
    });
};
//更新文章的踩数
exports.articleBadUpdate = function(id,callback){

    Article.find({id:id},function(err,article){

        article[0].bad = parseInt(article[0].bad +1);
        article[0].save(function(err,result){

            return callback(err,result);
        });
    });
};
//获取 上一篇和下一篇
exports.upAndDown = function(id,callback){

    //上一篇
    db.driver.execQuery("SELECT * FROM article as t1 WHERE t1.id < '"+id+"' order by id desc limit 0,1 ",function(err,up){
        //下一篇
        db.driver.execQuery("SELECT * FROM article as t1 WHERE t1.id > '"+id+"' order by id desc limit 0,1 ",function(err,down){

            var result = [up,down];

            return callback(err,result);
        });

    });


};

