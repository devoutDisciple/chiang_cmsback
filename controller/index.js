const userController = require('./userController');
const plateController = require('./plateController');
const loginController = require('./loginController');
const circleController = require('./circleController');
const topicController = require('./topicController');
const addressController = require('./addressController');
const bgController = require('./bgController');
const feedbackController = require('./feedbackController');
const postsController = require('./postsController');
const battleController = require('./battleController');
const voteController = require('./voteController');
const contentController = require('./contentController');
const goodsController = require('./goodsController');
const replyController = require('./replyController');
const attentionController = require('./attentionController');
const messageController = require('./messageController');
const videoController = require('./videoController');
const videoCoverController = require('./videoCoverController');
const albumController = require('./albumController');
const noticeController = require('./noticeController');
const searchCOntroller = require('./searchController');
const viewController = require('./viewController');
const testController = require('./testController');

const router = (app) => {
	// 登录相关
	app.use('/login', loginController);
	// 用户相关
	app.use('/user', userController);
	// 板块相关
	app.use('/plate', plateController);
	// 圈子相关
	app.use('/circle', circleController);
	// 话题相关
	app.use('/topic', topicController);
	// 位置相关
	app.use('/address', addressController);
	// 用户背景图
	app.use('/bgImg', bgController);
	// 意见反馈相关
	app.use('/feedback', feedbackController);
	// 帖子相关
	app.use('/posts', postsController);
	// 对决相关
	app.use('/battle', battleController);
	// 投票相关
	app.use('/vote', voteController);
	// 点赞相关
	app.use('/goods', goodsController);
	// 获取内容
	app.use('/content', contentController);
	// 评论相关
	app.use('/reply', replyController);
	// 关注相关
	app.use('/attention', attentionController);
	// 信息相关
	app.use('/message', messageController);
	// 视频相关
	app.use('/video', videoController);
	// 视频封面相关
	app.use('/videoCover', videoCoverController);
	// 相册相关
	app.use('/album', albumController);
	// 公告相关
	app.use('/notice', noticeController);
	// 搜索相关
	app.use('/search', searchCOntroller);
	// 浏览相关
	app.use('/viewRecord', viewController);

	// 测试相关 testController
	app.use('/test', testController);
};
module.exports = router;
