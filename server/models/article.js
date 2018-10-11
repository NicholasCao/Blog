const moment =require("moment");
const mongoose = require("mongoose");
moment.locale("zh-cn");

const Schema=mongoose.Schema;
const articleSchema = new Schema({
	title: String,
	content:String,
	desc:String,
	tags: [{
		type: String,
	}],
	createTime: {
		type: Date,
	},    
	lastEditTime: {
		type: Date,
		default: Date.now,
	},
	publish:Boolean
})
articleSchema.set("toJSON", { getters: true, virtuals: true });
articleSchema.set("toObject", { getters: true, virtuals: true });

//moment处理Date
articleSchema.path("createTime").get(function (v) {
	return moment(v).format("YYYY-MM-DD");
});
articleSchema.path("lastEditTime").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm");
});

module.exports = mongoose.model("Article", articleSchema)
