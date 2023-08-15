
var db = require('./mysql');

 var user = {

         id: { type: 'serial', key: true } , //主键
         username: String,
         password: String,
         created_at  : {type: 'integer',defaultValue: 0 },
         updated_at  : {type: 'integer',defaultValue: 0}
 };
var User = db.define('user',user);

module.exports = User;