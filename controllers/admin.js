var express = require('express');
var router = express.Router();
var user = require('../services/User');
var LocalStorage = require('node-localstorage').LocalStorage;
var storage = new LocalStorage('./scratch');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login',{error : ''});
});


router.post('/login', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    user.getUserInfo(username,password,function(err,result){
        if(err!=null && result.length==0)
        {
            res.render('admin/login',{error : '用户名或密码错误'});
        }else{
            if(err==null && result.length>0)
            {
                // localStorage.setItem('userInfo',JSON.stringify(result[0]));
                storage.setItem('userInfo',JSON.stringify(result[0]));
                // 如果用户名和密码正确，则跳转到后台首页
                res.render('admin/backend/index',{path : '',open:''});
            }
        }
    });
});


router.get('/**', function(req, res, next) {
    if(!storage.getItem('userInfo').id){
        res.render('admin/login',{error : '',open:''});
    }
});




module.exports = router;
