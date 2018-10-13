const Article = require("../models/article.js")

const getArticleById = async function (ctx){
	const id = ctx.params.id;
	let article = await Article.find({
		_id:id
	})
		.exec()
		.catch(err => {
			if (err.name === "CastError") {
				ctx.throw(404, "id不存在");
			} else {
				ctx.throw(500, "服务器内部错误");
			}
		});
		// console.log(article)
	ctx.body = {
		success: true,
		article
	};
}

const getArticleList = async function (ctx){
	let articleList = await Article.find({
		publish:true
	},['title', 'desc', 'createTime', '_id'])
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

const getTags = async function (ctx){
	let tags=[]
	let articleList = await Article.find({
		publish:true
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

const getArticleByTag = async function (ctx){
	const tag = ctx.params.tag;
	let articleList = await Article.find({
		tags:tag
	})
		.exec()
		.catch(err => {
			console.log(err);
		});
	ctx.body = {
		success: true,
		articleList
	};
}



module.exports = {
	getArticleById,
	getArticleList,
	getTags,
	getArticleByTag
}