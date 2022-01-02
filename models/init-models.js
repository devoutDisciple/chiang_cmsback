var Sequelize = require("sequelize").Sequelize;
var _account = require("./account");
var _address = require("./address");
var _album = require("./album");
var _battle = require("./battle");
var _battle_record = require("./battle_record");
var _bg_img = require("./bg_img");
var _circle = require("./circle");
var _comment_record = require("./comment_record");
var _content = require("./content");
var _data = require("./data");
var _feedback = require("./feedback");
var _goods_record = require("./goods_record");
var _message = require("./message");
var _notice = require("./notice");
var _plate = require("./plate");
var _posts = require("./posts");
var _register = require("./register");
var _topic = require("./topic");
var _user = require("./user");
var _user_attention_circle = require("./user_attention_circle");
var _user_attention_user = require("./user_attention_user");
var _video = require("./video");
var _view_record = require("./view_record");
var _vote = require("./vote");
var _vote_record = require("./vote_record");

function initModels(sequelize) {
  var account = _account(sequelize, Sequelize);
  var address = _address(sequelize, Sequelize);
  var album = _album(sequelize, Sequelize);
  var battle = _battle(sequelize, Sequelize);
  var battle_record = _battle_record(sequelize, Sequelize);
  var bg_img = _bg_img(sequelize, Sequelize);
  var circle = _circle(sequelize, Sequelize);
  var comment_record = _comment_record(sequelize, Sequelize);
  var content = _content(sequelize, Sequelize);
  var data = _data(sequelize, Sequelize);
  var feedback = _feedback(sequelize, Sequelize);
  var goods_record = _goods_record(sequelize, Sequelize);
  var message = _message(sequelize, Sequelize);
  var notice = _notice(sequelize, Sequelize);
  var plate = _plate(sequelize, Sequelize);
  var posts = _posts(sequelize, Sequelize);
  var register = _register(sequelize, Sequelize);
  var topic = _topic(sequelize, Sequelize);
  var user = _user(sequelize, Sequelize);
  var user_attention_circle = _user_attention_circle(sequelize, Sequelize);
  var user_attention_user = _user_attention_user(sequelize, Sequelize);
  var video = _video(sequelize, Sequelize);
  var view_record = _view_record(sequelize, Sequelize);
  var vote = _vote(sequelize, Sequelize);
  var vote_record = _vote_record(sequelize, Sequelize);


  return {
    account,
    address,
    album,
    battle,
    battle_record,
    bg_img,
    circle,
    comment_record,
    content,
    data,
    feedback,
    goods_record,
    message,
    notice,
    plate,
    posts,
    register,
    topic,
    user,
    user_attention_circle,
    user_attention_user,
    video,
    view_record,
    vote,
    vote_record,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
