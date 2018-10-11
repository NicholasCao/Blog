> 由于前段时间外出，电脑不在身边，打断了原本打算连续两更的计划，时间隔得长很多项目细节都忘了
> 并且个人觉得我后台管理部分写得并不好，所以就写得没有上篇文章详细，而是选一些关键部分来写

## 简介
文章涉及：
* jwt进行auth用户验证
* bcrypt加密
* webpack打包
* 项目部署

## JSON Web Token
我的登录系统采用的是时下比较热门的json-web-token（简称jwt）

#### 简述jwt（copy）
它的流程是这样的：
1. 用户在登录页输入账号密码，将账号密码发送请求给后端
2. 后端验证一下用户的账号和密码的信息，如果符合，就下发一个TOKEN返回给客户端。如果不符合就不发送TOKEN回去，返回验证错误信息。
3. 如果登录成功，客户端将TOKEN用某种方式存下来（SessionStorage、LocalStorage）,之后要请求其他资源的时候，在请求头（Header）里带上这个TOKEN进行请求。
4. 后端收到请求信息，先验证一下TOKEN是否有效，有效则下发请求的资源，无效则返回验证错误。

 通过这个TOKEN的方式，客户端和服务端之间的访问，是无状态的：也就是服务端不知道你这个用户到底还在不在线，只要你发送的请求头里的TOKEN是正确的我就给你返回你想要的资源。这样能够不占用服务端宝贵的空间资源，而且如果涉及到服务器集群，如果服务器进行维护或者迁移或者需要CDN节点的分配的话，无状态的设计显然维护成本更低。
  
	简单的了解jwt之后，我们可以把它放到我们的应用中。
 
 **npm install koa-jwt**安装Koa的JSON-WEB-TOKEN库。也可使用**yarn**
 这里还有一个小坑，jwt是包含两个库koa-jwt、jsonwebtoken（后者在安装koa-jwt时会同时安装），引入时要注意区分。
 
 ```javascript
 //server/controllers/admin.js
 
 const jwt = require("jsonwebtoken")//一般签发token引入jsonwebtoken
 ...
 //控制login的函数
 const login = async function (ctx) {
	const username = ctx.request.body.username;
	const password = ctx.request.body.password;
	let admin = await Admin.findOne({
		username,
	}).exec();
	if (admin !== null) {
		const pwdMatchFlag =bcrypt.compareSync(password, admin.password);//bcrypt加密,后文会讲
		if (pwdMatchFlag) {
			const token = jwt.sign({
				uid: admin._id,
				name: admin.username,
			}, config.jwt.secret); //sign签发token，config.jwt.secret是自己定义的密匙，这是之后用来判断token合法性的标志
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
 ```
 前端请求时，同时用session储存token
 ```vue
 //src/pages/login/index.vue
 
 ....
  this.$http.post("/admin/login", obj)
        .then((res) => {
          if(res.data.success){
            sessionStorage.setItem("demo-token",res.data.token); // 用sessionStorage把token存下来
            this.$message({ // 登录成功，显示提示语,$message是element-ui的提示框用法
              type: "success",
              message: "登录成功！"
            }); 
            this.$router.push("/me") // 进入me页面，登录成功
          }else{
            this.$message.error(res.data.info); // 登录失败，显示提示语
            sessionStorage.setItem("demp-token",null); // 将token清空
          }
        }, (err) => {
            console.log(err)
            this.$message.error("请求错误！")
            sessionStorage.setItem("demo-token",null); // 将token清空
        })
...

 ```
 
 因为我们用了koa-jwt，所以只需要在每条请求头上加上Authorization属性，值是Bearer {token值}，然后让Koa在接收请求之前验证一下token即可。为了避免繁琐，我们可以做到全局Header设定。
 同时加入钩子函数，避免url栏输入'/me'免除登录直接进入登录后的界面
 
 
 ```javascript
  //src/router/index.js
	
	...
 router.beforeEach((to,from,next) =>{
  const token = sessionStorage.getItem("demo-token");//获取token
  if(to.path == "/login"){ // 如果是跳转到登录页的
    if(token != "null" && token != null){
      next("/me") // 如果有token就转向me不返回登录页
    }
    next(); // 否则跳转回登录页
  }else if(to.path == "/me"){
    if(token != "null" && token != null){
      // 全局设定header的token验证，注意Bearer后有个空格
      Vue.prototype.$http.defaults.headers.common["Authorization"] = "Bearer " + token;
      next();// 如果有token就正常转向
    }else{
      next("/login") // 否则跳转回登录页
    }
  }else{
    next();
  }
})

...

```
 那我们要如何进行jwt验证呢
 
 
 ```javascript
//app.js
 
 const jwt = require("koa-jwt")
 ...
 
router.use("/api",api.routes())
router.use("/admin",jwt({secret: config.jwt.secret}).unless({ path: [/^\/admin\/login/]}),admin.routes())// config.jwt.secret是密钥
//直接这样使用中间件验证
//unless-除了login的api请求其余都要通过中间件验证
app.use(router.routes());

 ```
 ## bcrypt加密
 bcrypt的简单教程我推荐的是这篇文章
 https://blog.csdn.net/original_heart/article/details/78538908?reload
 下面我也简单的演示一下
 ```javascript
 //server/controllers/admin.js
 
 const bcrypt = require("bcrypt")
 ...
 
 const initAdmin = async function () {
	const saltRounds = 10;//生成salt的迭代次数
	let password = config.admin.pwd
	bcrypt.genSalt(saltRounds, function(err, salt){
		bcrypt.hash(password,salt, function(err, hash){
				//把hash值赋值给password变量
				password = hash;
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


 const pwdMatchFlag =bcrypt.compareSync(password, admin.password);//验证密码正确与否
 ...
 ```
 
 ## webpack打包优化
 
 对于webpack打包优化我推荐的是这两篇文章
[Webpack 打包优化之体积篇](https://jeffjade.com/2017/08/06/124-webpack-packge-optimization-for-volume/)
[Webpack 打包优化之速度篇](https://jeffjade.com/2017/08/12/125-webpack-package-optimization-for-speed/)
 里面有很多实用的插件、技巧等等，本文不一一赘述。
 我这里主要讲减小**npm build**之后减小打包体积效果最为明显的三个方法。
 
 #### 取消输出map文件
 map文件是webpack打包后的映射文件，方便调试。
 在开发模式中，我们可以把它去掉，以减小体积。
 找到根目录下的**config/index.js**把**productionSourceMap: true**改为**productionSourceMap: false**即可取消输出map文件。
 
 #### 外部引入模块(cdn)
 在去掉了map文件后，我重新**npm run build**，发现文件依然很大，足足2G
 ```javascript
 // build/webpack.base.conf.js
  externals:{
    'vue': 'Vue',
    'element-ui': 'ElementUI',
    'axios': 'axios',
    'highlight.js': 'hljs',
    'marked': 'marked',
    'simplemde': 'SimpleMDE'
  },
//key 是 require 的包名，value 是全局的变量。

//index.html
    <script src="https://unpkg.com/vue@2.5.17/dist/vue.js"></script>
    <script src="https://unpkg.com/element-ui@2.4.5/lib/index.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <script src="https://unpkg.com/axios@0.18.0/dist/axios.min.js"></script>
    <script src="https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js"></script>
    <script >hljs.initHighlightingOnLoad();</script>
    <script src="https://unpkg.com/marked@0.4.0/lib/marked.js"></script>
    <script src="https://cdn.bootcss.com/simplemde/1.11.2/simplemde.min.js"></script>
    <link href="https://cdn.bootcss.com/simplemde/1.11.2/simplemde.min.css" rel="stylesheet">
		//我这里引入得比较乱，有unpkg的，也有bootcss的，大家不要学习
```

#### gzip
还是找到根目录下的**config/index.js**，**productionGzip: false,**改成**true**

服务器端上找到nginx所在文件夹进入**nginx/conf/nginx.conf**
把**gzip on;**取消注释
![](http://nicholas-image.oss-cn-shenzhen.aliyuncs.com/18-8-30/41070545.jpg)
看到vender.\*.js的header出现gzip就行了

这样三个步骤下来vender文件就只有9KB了

## 项目部署

1.到\*\*云上购买服务器
2.环境搭建(安装node.js、mongodb、nginx)
3.将源文件（打包好的）连同node_modules上传到服务器
node_modules也上传的原因可以参照这篇文章
[科普文：为什么不能在服务器上 npm install ？](https://zhuanlan.zhihu.com/p/39209596)
4.配置nginx文件

如果是Linus系统，**vim nginx.conf**
按 i 进入插入模式，然后就可以修改
按**esc**退出模式，再输入**wq**回车，即可保存并退出
```
http {
  # ....
  upstream koa.server{
    server 127.0.0.1:port;//port填自己的端口
  }

  server {
    listen   80;
    server_name xxx.xxx.com;//填自己的域名,无域名可不写

    location / {
      proxy_pass http://koa.server;
      proxy_redirect off;
    }

    #....
  }
  #....
}
```
5. node app.js线上测试一下
6. 虽然说node也可以后台运行，但还是推荐使用pm2

只需要**$ npm install pm2 -g**
**$ pm2 start app.js**
而且它还具有查看实时日志等功能

这样我们就完整的完成一个全栈项目了


[项目地址](https://github.com/NicholasCao/Blog)，欢迎Star！