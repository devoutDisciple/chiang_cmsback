const accountController = require('./accountController');
const dataController = require('./dataController');
const userController = require('./userController');
const plateController = require('./plateController');
const circleController = require('./circleController');
const addressController = require('./addressController');
const contentController = require('./contentController');
const topicController = require('./topicController');
const feedbackController = require('./feedbackController');
const replyController = require('./replyController');
const goodsController = require('./goodsController');

const router = (app) => {
	// 登录相关
	app.use('/account', accountController);
	// 数据汇总
	app.use('/data', dataController);
	// 用户相关
	app.use('/user', userController);
	// 板块相关
	app.use('/plate', plateController);
	// 圈子相关
	app.use('/circle', circleController);
	// 地址相关
	app.use('/address', addressController);
	// 话题相关
	app.use('/topic', topicController);
	// 内容相关
	app.use('/content', contentController);
	// 评论相关
	app.use('/reply', replyController);
	// 点赞相关
	app.use('/goods', goodsController);
	// 意见反馈
	app.use('/feedback', feedbackController);
};
module.exports = router;
