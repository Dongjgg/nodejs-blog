
var User = require("../models/user");
var db = require("../models/mysql");

/**
 * 根据用户名字获取用户信息
 * @param name
 * @param callback
 * @returns {*}
 */
exports.getUserInfo = function (username, password, callback) {
    // 根据用户名和密码查询用户信息
    var sql = "select * from user where username = '" + username + "' and password = '" + password + "'";
    console.log(sql);



    // 执行查询语句，获取查询结果
    db.driver.execQuery(sql, function (err, result) {
        // 如果查询成功，则返回查询结果
        return callback(err, result);
    });
};


/**
 * 根据username查询用户
 * @param {用户名} username 
 * @param {*} callback 
 */
exports.userByUsername = function (username, callback) {

    User.find({ username: username }, function (err, user) {

        return callback(err, user);
    });
};
