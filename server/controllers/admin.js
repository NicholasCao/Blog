const Admin = require("../models/admin.js"),
	bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	config = require("../config/index.js");

const Article = require("../models/article.js")

const initAdmin = async function () {
	//bcrypt加密
	const saltRounds = 10;
	let password = config.admin.pwd
	bcrypt.genSalt(saltRounds, function(err, salt){
		bcrypt.hash(password,salt, function(err, hash){
				//把hash值赋值给password变量
				password = hash;
				// console.log(password);
				storeAdmin(password);
		})
	})
	async function storeAdmin (password){
					//储存到数据库
		let admin = await Admin.find().exec().catch(err => {
			console.log(err);
		});
		if (admin.length === 0) {
			admin = new Admin({
				username: config.admin.user,
				password: password
			});
			await admin.save().catch(err => {
				console.log(err);
			});
		}
	}
}

initAdmin()

const login = async function (ctx) {
	const username = ctx.request.body.username;
	const password = ctx.request.body.password;
	let admin = await Admin.findOne({
		username,
	}).exec();
	if (admin !== null) {
		const pwdMatchFlag =bcrypt.compareSync(password, admin.password);
		if (pwdMatchFlag) {
			const token = jwt.sign({
				uid: admin._id,
				name: admin.username,
				// exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 hours
			}, config.jwt.secret);
			ctx.body = {
				success: true,
				uid: admin._id,
				name: admin.username,
				token: token,
			};
		} else {
			ctx.body = {
        success: false, // success标志位是方便前端判断返回是正确与否
        info: "密码错误！"
      }
		}
	} else {
		ctx.body = {
      success: false,
      info: "用户不存在！" 
    }
	}
}

const addArticle = async function (ctx){
	var article=new Article();
	article.title = ctx.request.body.title;
	article.content = ctx.request.body.content;
	article.desc = ctx.request.body.desc;
	article.tags = ctx.request.body.tags;
	article.publish = ctx.request.body.publish;
	article.createTime = new Date();
	article.lastEditTime = new Date();

	let result=await article.save().catch(err => {
		ctx.throw(500, "服务器内部错误");
	})
	// console.log(result);
	ctx.body = {
		success: true,
		article: result,
	};
	console.log("文章创建成功");
}
const modifyArticle =async function (ctx) {
	// console.log(ctx.request.body)
	const id = ctx.params.id;
	if(ctx.request.body.changePublish){
		delete ctx.request.body.changePublish
		const article = await Article.findByIdAndUpdate(id, {publish:ctx.request.body.publish}).catch(err => {
			console.log(err)
		});
	}
	else{
		const article = await Article.findByIdAndUpdate(id, ctx.request.body).catch(err => {
			console.log(err)
		});
	}
		ctx.body = {
				success: true,
		};
}
const deleteArticle = async function (ctx) {
	const id = ctx.params.id;
	const article = await Article.findByIdAndRemove(id).catch(err => {
		console.log(err)
	});
	ctx.body = {
			success: true,
	};
}

const getAllArticles = async function (ctx){
	let articleList = await Article.find({
	})
		.sort({ createTime: -1 })
		.exec()
		.catch(err => {
			console.log(500,"服务器内部错误")
		});
	// console.log(articleArr)
	ctx.body = {
		success: true,
		articleList
	};
}

const getAllTags = async function (ctx){
	let tags=[]
	let articleList = await Article.find({
	})
		.sort({ createTime: -1 })
		.exec()
		.catch(err => {
			console.log(500,"服务器内部错误")
		});
	for(let i=0;i<articleList.length;i++){
		for(let j=0;j<articleList[i].tags.length;j++){
			if(tags.indexOf(articleList[i].tags[j])==-1)tags.push(articleList[i].tags[j]);
		}
	}
	ctx.body = {
		success: true,
		tags
	};
}

module.exports = {
	initAdmin,
	login,
	addArticle,
	getAllArticles,
	getAllTags,
	deleteArticle,
	modifyArticle
}
