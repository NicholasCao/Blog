## 简介
本文讲述从零开始搭建一个通过Koa提供API让前端获取数据，Vue实时渲染页面的完整全栈项目。
主要涉及：
Vue前端渲染，路由配置
Koa提供API接口，配置路由
mongoose操作MongoDB数据库
。。。

## 前言
其实这是我第一次写全栈项目，在此之前几乎是对MongoDB、MySQL等数据库一无所知，Koa也用得不太熟练。
在这种前后端分离的开发模式也是个纯粹的新手，期间也踩了不少坑，所以写一篇文章来记录一下，另外也可以对后来者有所启发。如果文章涉及到错误，欢迎指正！

## 项目结构
```code
.
├── LICENSE
├── README.md
├── app.js  // Koa入口文件
├── build // vue-cli 生成，用于webpack监听、构建
		 ├── build.js
		 ├── check-versions.js
		 ├── dev-client.js
		 ├── dev-server.js
		 ├── utils.js
		 ├── webpack.base.conf.js
		 ├── webpack.dev.conf.js
		 └── webpack.prod.conf.js
├── config // vue-cli 生成&自己加的一些配置文件
     ├── dev.env.js
		 ├── dev.env.js
		 ├── index.js
		 └── prod.env.js
├── dist // Vue build 后的文件夹
		 ├── index.html // 入口文件
		 └── static // 静态资源
├── index.html // vue-cli生成，用于容纳Vue组件的主html文件。
├── package.json // npm的依赖、项目信息文件
├── server // Koa后端，用于提供Api
		 ├── config // 配置文件夹
		 ├── controllers // controller-控制器
		 ├── models // model-模型
		 └──  routes // route-路由
├── src // vue-cli 生成
		 ├── App.vue // 主文件
		 ├── assets // 相关静态资源存放
		 ├── components // 单文件组件
		 ├── lib //依赖
		 ├── pages //页面组件
		 ├── stylus //存放stylus文件
		 └──  main.js // 引入Vue等资源、挂载Vue的入口js
└── package-lock.json
```


##项目主要的依赖
"axios": "^0.18.0",
"koa": "^2.5.2",
"koa-history-api-fallback": "^0.1.3",
"koa-router": "7.4.0",
"koa-static": "^5.0.0",
"marked": "^0.4.0",
"moment": "^2.22.2",
"mongodb": "^3.1.1",
"mongoose": "^5.2.4",
"stylus": "^0.54.5",
"stylus-loader": "^3.0.2",
"vue": "^2.5.2",
"vue-router": "^3.0.1"
剩余依赖可到[github](https://github.com/BUPT-HJM/vue-blog/blob/master/package.json)上查看

## 项目启动
Node.js、vue与npm的安装不再叙述,当然vue的脚手架工具vue-cli和MongoDB也不要忘记安装。

我们初始化一个webpack模板 
vue init webpack demo  (demo处填写项目名称) 
建议不要开启eslint,其他可以一直按回车
 
 #### 安装依赖
 
> 你可以到我的[github](https://github.com/BUPT-HJM/vue-blog/blob/master/package.json)上把package.json上的所有依赖复制到本地，**npm install**
> 当然你也可以一个一个依赖自己安装

在vue-cli的生产的根目录下，建立server文件夹以及子文件夹
```code
├── server // Koa后端，用于提供Api
		 ├── config // 配置文件夹
		 ├── controllers // controller-控制器
		 ├── models // model-模型
		 └──  routes // route-路由
```

在根目录下创建一个**app.js**文件，作为koa的入口文件

## 构建前端页面
进入**src/main.js**，文件将如下
```javasript
import Vue from 'vue'
import App from './App'
import router from './router'

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```

为了实现响应式页面，我们要在项目目录下的index.html的head标签内加入以下meta：

```html
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```
在根目录下打开cmd,**npm run dev**将启动开发模式，并且有热加载功能

打开浏览器，在url栏输出:**localhost:8080**将会显示Vue的初始页面

进入**src**目录，创建一个pages文件夹，用于存放页面文件，这只是个人偏好，你也可以将页面文件放在components文件夹中

在pages文件夹中，创建home文件夹，存放博客的主页，并创建**index.vue**,开始写第一个页面
```vue
<template>
	<div id="article">
		<div id="article-box">
			<div v-for="(article, index) in articleList" class="article-item">
				<h2 class="title">
					<router-link to="/article">{{article.title}}</router-link>
				</h2>
				<p class="desc">
					{{article.desc}}
				</p>
				<div class="time">
					<span>{{article.createTime}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				name: '', 
				articleList:[
					{
						title:"标题",
						tags:["标签"],
						desc:"描述",
						createTime:"2018-8-7"
					}
				]
			};
		},
		methods:{
			}
		},
	}
</script>
<style lang="stylus" scoped>
	//css预加载我使用的是stylus
	//scoped属性是为了实现私有化样式
	//样式我就不写了
a 
	text-decoration none
</style>
```
页面写完之后，如果不把页面挂载到路由是不会显示的。
不清楚页面路由的，可以参照官方文档https://cn.vuejs.org/v2/guide/routing.html
进入**src/router/index.js**
将页面修改为
```js
import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/home'

Vue.use(Router)

export default new Router({
  mode: 'history',//使用history模式
  routes: [
    {
      path: '/',
      component: home
    },
  ]
})
```
打开App.vue,确认路由页面写入app
```vue
	<template>
  <div id="app">
		<img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```
此时打开浏览器就能看到

![](http://nicholas-image.oss-cn-shenzhen.aliyuncs.com/18-8-7/10796442.jpg)
如果不需要这个图片
进入**src/App.vue**
将img删掉
```html
<img src="./assets/logo.png">
```
同样我们写一下article页面
```vue
src/pages/article/index.js
<template>
	<div id="article-box">
		<article>
			<h1 id="title">{{title}}</h1>
			<h4 id="time">
				{{createTime}}
			</h4>
			<div class="tag-list" style="margin: 20px 0;">
				<span class="tag" v-for="tag in tags">
					{{tag}}
				</span>
			</div>
			<div v-html="compiledMarkdown" id="markdown-content">//v-html会将元素当成HTML标签解析后输出
			</div>
		</article>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				'id':'',
				'title': '标题',
				'desc':'描述',
				'createTime': '2018-8-7',
				'content': '这是内容',
				'lastEditTime': null,
				'tags': ['标签'],
				'compiledMarkdown':'<p>这是内容</p>'
			};
		},
		methods:{
		},
		mounted() {
		}
	}
</script>
<style lang="stylus" scoped>
</style>
```
挂载路由上
```js
...
import article from '../pages/article'
...
...
	{
      path: '/article',
      component: article
    }
```
我们再打开浏览器，点击标题或者直接打开http://localhost:8080/article 就能看到article页面

可以看到我们的前端页面是直接写死的，没有获取到博客内容
于是我们可以先把前端放一放，开始我们的后端之旅。

## 搭建后端环境
返回根目录
写入app.js
```javascript
const Koa = require('koa'),
  koaRouter = require('koa-router'),
  json = require('koa-json'), 
  logger = require('koa-logger'),// 引入各种依赖

const app = new Koa(),
  router = koaRouter();
	
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.on('error', function(err, ctx){
  console.log('server error', err);
});

app.listen(8889,() => {
  console.log('Koa is listening in 8889');
});
```
打开另一个cmd窗口，输入**node app.js**
能看到输出**Koa is listening in 8889**，则说明我们的Koa已经启动成功了，并在8889端口监听。
#### MongoDB
数据库我们采用Node界大家普遍喜爱的Mongodb,为了操作数据库我们使用Mongoose
我们先连接Mongodb,在此之前确保你已安装mongodb，并且开启服务
安装过程中，建议初学者把**MongoDB Compass Community**也勾选上，这里安装最好挂上vpn，我当时就没挂，安装了半个小时😂

```javascript
//app.js
...
const  mongoose =require('mongoose');
...
mongoose.connect('mongodb://127.0.0.1:27017/test');//数据库地址
mongoose.connection.on('error', console.error);
mongoose.connection.on('open', () => console.log('MongoDB connection successed'));

const app = new Koa(),
  router = koaRouter();
....
```
重新启动app.js
看到输出**'MongoDB connection successed'**，即已成功连接
进入server/models/article.js
```javascript
const moment =require('moment');//处理Date
const mongoose = require('mongoose');
moment.locale('zh-cn');

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
articleSchema.set('toJSON', { getters: true, virtuals: true });
articleSchema.set('toObject', { getters: true, virtuals: true });

//moment处理Date
articleSchema.path('createTime').get(function (v) {
	return moment(v).format('YYYY-MM-DD');
});
articleSchema.path('lastEditTime').get(function (v) {
	return moment(v).format('YYYY-MM-DD');
});

module.exports = mongoose.model('Article', articleSchema)
```

moment是用于处理Date的一个依赖，我们这里可以忽略，这样我们就创建了一个modles

```javascript
//server/controllers/article.js
const Article = require('../models/article.js')

const addArticle = async function (ctx){
	var article=new Article();
	article.title = ctx.request.body.title;
	article.content = ctx.request.body.content;
	article.desc = ctx.request.body.desc;
	article.tags = ctx.request.body.tags;
	article.createTime = new Date();
	article.lastEditTime = new Date();
	article.publish = true;

	let result=await article.save().catch(err => {
		ctx.throw(500, '服务器内部错误');
	})
	ctx.body = {
		success: true,
		article: result,
	};
	console.log('文章创建成功');
}

addArticle({
	request:{
		body:{
			title:'这是创建的文章标题',
			content:'新创建的内容',
			desc:'新创建的描述',
			tags:['新标签']
		}
	}
})
//这里我们先直接调用函数创建一篇文章

const getArticleById = async function (ctx){
	const id = ctx.params.id;
	let article = await Article.find({
		_id:id
	})
		.catch(err => {
			if (err.name === 'CastError') {
				ctx.throw(400, 'id不存在');
			} else {
				ctx.throw(500, '服务器内部错误');
			}
		});
	ctx.body = {
		success: true,
		article
	};
}

const getArticleList = async function (ctx){
	let articleList = await Article.find({
		publish:true
	})
		.sort({ createTime: -1 })
		.catch(err => {
			console.log(500,'服务器内部错误')
		});
	ctx.body = {
		success: true,
		articleList
	};
}

module.exports = {
	addArticle,
	getArticleById,
	getArticleList
}
```

在routes/api.js中写入路由
```javascript
const article = require('../controllers/article.js');
const router = require('koa-router')();

router.get('/article',article.getArticleList)
	.post('/article',article.addArticle)
	.get('/article/:id', article.getArticleById)

module.exports = router;
```
然后回到根目录下的app.js中挂载路由,改写如下
```javascript
const Koa = require('koa'),
  koaRouter = require('koa-router'),
  json = require('koa-json'), 
  logger = require('koa-logger'),
  api = require('./server/routes/api.js'),
  mongoose =require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test');
mongoose.connection.on('error', console.error);
mongoose.connection.on('open', () => console.log('MongoDB connection successed'));

const app = new Koa(),
  router = koaRouter();

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.on('error', function(err, ctx){
  console.log('server error', err);
});

router.use('/api',api.routes())

app.use(router.routes());

app.listen(8889,() => {
  console.log('Koa is listening in 8889');
});
```
打开你的控制台，输入**node app.js**，运行正常没有报错的话，我们的第一个API已经构建完成！

现在问题来了。我们要如何测试呢？
#### API Test
在测试接口的工具上，我推荐**Postman**，这个工具能够很好的模拟发送的各种请求，方便的查看响应结果，用来进行测试是最好不过了。
如果仅仅是get请求的话，浏览器也可以很好的完成这个任务

获取文章列表
在url栏输入 **localhost:8080/api/article/** 能看到文章列表

查找文章
打开**MongoDB Compass Community**，查到刚刚创建的文章id，并如图写入url
![](http://nicholas-image.oss-cn-shenzhen.aliyuncs.com/18-8-15/82560403.jpg)
测试成功，我成功的拿到了我想要的数据。

但现在我们仍有一个问题，我们的界面跑在8080端口，但是Koa提供的API跑在8889端口，所以如果直接通过/auth/user这个url去post是请求不到的。

这个时候最方便用一种比较简便的解决办法：
把跨域变成同域请求问题
打开根目录下的config/index.js，找到dev下的proxyTable。修改如下
```javascript
	 proxyTable: {
		'/api':{
			target: 'http://localhost:8889',
			changeOrigin: true
		}
	}
```

这样我们的后端就环境就暂告一段落了
## 前端渲染
这个部分就是前端拿到后端api的数据进行页面渲染
**ajax**我们使用axios
安装axios。然后我们在src/main.js里面引入axios：
```javascript
import Axios from 'axios'

Vue.prototype.$http = axios //避免多次引入,之后可以在实例里直接用this.$http.get()
```
将src/pages/home/index.vue改写如下
```vue
<template>
	<div id="article">
		<div id="article-box">
			<div v-for="(article, index) in articleList" class="article-item">
				<h2 class="title">
					<router-link :to="'/Article/'+article.id">{{article.title}}</router-link>
				</h2>
				<p class="desc">
				{{article.desc}}
				</p>
				<div class="time">
					<span>{{article.createTime}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				name: '', 
				articleList:[
				]
			};
		},
		methods:{
			getArticleList(){
				this.$http.get('/api/article')
				.then((res) => {
					if(res.status == 200){
					this.articleList = res.data.articleList;
					// console.log(res.data)
					}else{
					console.log('err');
					}
				}, (err) => {
					console.log(err);
				})
			}
		},
		created(){
			this.getArticleList();
		}
	}
</script>

<style lang="stylus" scoped>
</style>
```
同样改写article/index.vue
```vue
<template>
 <div id="article-box">
        <article>
            <h1 id="title">{{title}}</h1>
            <h4 id="time">
                {{createTime}}
            </h4>
            <div class="tag-list" style="margin: 20px 0;">
                <span class="tag" v-for="tag in tags">
                    {{tag}}
                </span>
            </div>
            <div v-html="compiledMarkdown" id="markdown-content">//v-html会将元素当成HTML标签解析后输出
            </div>
        </article>
    </div>
</template>
<script>
	import marked from '../../lib/marked.js'//用到了marked，有兴趣的可以的github上查看
	export default {
		data () {
			return {
				'id':'',
				'title': '',
				'desc':'',
				'createTime': '',
				'content': '',
				'lastEditTime': null,
				'tags': [],
			};
		},
		methods:{
			getArticle(){
				this.$http.get('/api/article/'+this.id) 
				.then((res) => {
					if(res.status == 200){
						this.id = res.data.article[0]._id
						this.title = res.data.article[0].title
						this.desc = res.data.article[0].desc
						this.createTime =res.data.article[0].createTime
						this.content = res.data.article[0].content
						this.lastEditTime = res.data.article[0].lastEditTime
						this.tags = res.data.article[0].tags
					}else{
						this.title = '404 not found';
						this.createTime = '';
						this.content = '';
						this.lastEditTime = null;
						this.tags = [];
					}
				}, (err) => {
					alert('网络错误');
					console.log(err)
				})
			}
		},
		mounted() {
			this.id=this.$route.params.id;
			this.getArticle();
		},
		computed:{
			compiledMarkdown () {
				return marked(this.content)
			}
		}
	}
</script>
<style lang="stylus" scoped>
</style>
```
（由于中途我把这个半成品的项目不小心删掉了，就没有截图了😌）
这样我们的两个页面都完成了前后端通信，到此我们一个完整的前后端分离项目也算是完成了，当然这个项目没有后台，写博文需要进入直接写入数据是很不科学的，下一篇博文我们将完善这个项目。

最后放上本文项目的[Github地址](https://github.com/NicholasCao/blog-demo)，如果这个项目对你有帮助，希望大家可以fork，给我提建议，如果再有时间，可以点个Star那就更好啦~