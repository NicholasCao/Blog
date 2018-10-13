const config = {
	mongodb: {
		url:'mongodb://127.0.0.1:27017/test',
	},
	jwt: {
		secret: 'blog-demo', // jwt密匙
	},
	mongodbSecret: { // mongodb用户和密码
		user: '',
		pass: '',
	},
	admin: { // 后台初始化的用户名密码
		user: '123456',
		pwd: '123456',
	}
};

module.exports= config;
