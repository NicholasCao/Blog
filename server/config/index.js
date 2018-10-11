const config = {
	mongodb: {
		url:'mongodb://127.0.0.1:27017/test',
	},
	jwt: {
		secret: 'Nicholas-blog', // jwt密匙
	},
	mongodbSecret: { // mongodb用户和密码
		user: '',
		pass: '',
	},
	admin: { // 后台初始化的用户名密码
		user: 'Nicholas',
		pwd: 'Caotf0426',
	}
};

module.exports= config;
