<template>
	<div style="height:100%;background:#fff;">
		<navHeader  :isShort="asideStatus=='show'||!asideStatus" :class="{'longHeader':asideStatus=='hide','shortHeader':asideStatus=='show'}"></navHeader>
		<div id="main">
			<aside :class="asideStatus">
				<div id="me">
					<div class="sth">
						Learn more, 					
						</br>know less.
					</div>
					<div class="avatar">
						<img src="http://nicholas-image.oss-cn-shenzhen.aliyuncs.com/18-8-3/34829329.jpg" style="width:50px">
					</div>
				</div>
				<div id="catalog-header">
					Catalog
				</div>
				<div id="catalog-box">
					<ul>
						<li v-for="(item,index) in catalog">
							<a :class="{'h2':item.tagName=='H2','h4':item.tagName=='H4','catalogLink-active':index==activeIndex}" @click=clickCatalog(item.id)>{{item.text}}</a><br/>
						</li>
					</ul>
				</div>
			</aside>
			<div id="overlay" v-if="isMobile&&asideStatus=='show'" @touchstart="changeAsideStatus">
			</div>	
			<div id="article-box" :class="{'leftArticle':asideStatus=='hide','rightArticle':asideStatus=='show'}">
				<article>
					<h1 id="title">{{title}}</h1>
					<h3 id="time">
						{{createTime}}
					</h3>
					<div class="tag-list" style="margin: 20px 0;">
						<span class="tag" v-for="tag in tags">
							<router-link :to="'/Tags/'+tag" >
								<span>{{tag}}</span>
							</router-link>
						</span>
					</div>
					<div v-html="compiledMarkdown" id="markdown-content" ref="articleBody">
					</div>
				</article>
				<v-footer></v-footer>
			</div>
		</div>
		<scollbtn></scollbtn>
		<i :class="{'el-icon-back':true,'buttonToShow':asideStatus=='hide','buttonToHide':asideStatus=='show','mobileButton':asideStatus=='mobile'}" @click=changeAsideStatus></i>
	</div>
</template>

<script>
	import marked from "../../lib/marked.js";
	export default {
		data () {
			return {
				"id":"",
				"title": "",
				"desc":"",
				"createTime": "",
				"content": "",
				"lastEditTime": null,
				"tags": [],
				"catalog": [],
				"domScrollTop": [],
				"activeIndex": 0,
				"asideStatus": null,
				"isMobile": false
			};
		},
		methods:{
			scroll() {
				window.onscroll = () => {
					var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
					for(var i = this.domScrollTop.length-1 ; i>=0; i--){
						if(scrollTop>this.domScrollTop[i]){
							this.activeIndex = i;
							break;
						}
					}
				};
			},
			changeAsideStatus() {
				this.asideStatus = this.asideStatus=='hide' || this.asideStatus=='mobile'?'show':'hide'
			},
			clickCatalog(id) {
				this.jump(id)
				if(this.isMobile)this.changeAsideStatus()
			},
			jump(id) {
				let jump = document.querySelector(id);
				let total = jump.offsetTop;
				let distance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ;
				// 平滑滚动，时长300ms，每10ms一跳，共30跳
				let isSafari=window.pageYOffset ? true : false;
				let step = total / 30
				if (total > distance) {
					smoothDown();
				} else {
					let newTotal = distance - total;
					step = newTotal / 30;
					smoothUp();
				}
				function smoothDown () {
					if (distance < total) {
						distance += step;
						document.body.scrollTop = distance;
						document.documentElement.scrollTop = distance;
						window.pageYOffset = distance;
						setTimeout(smoothDown, 10);
					} else {
						document.body.scrollTop = total;
						document.documentElement.scrollTop = total;
						window.pageYOffset = isSafari ? total : undefined;
					}
				}
				function smoothUp () {
					if (distance > total) {
						distance -= step;
						document.body.scrollTop = distance;
						document.documentElement.scrollTop = distance;
						window.pageYOffset = distance;
						setTimeout(smoothUp, 10);
					} else {
						document.body.scrollTop = total;
						document.documentElement.scrollTop = total;
						window.pageYOffset = isSafari ? total : undefined;
					}
				} 
			},
			getArticle() {
				this.$http.get("/api/article/"+this.id) 
				.then((res) => {
					if(res.status == 200){
						this.id = res.data.article[0]._id
						this.title = res.data.article[0].title
						document.title = res.data.article[0].title +	' - Nicholas'
						this.desc = res.data.article[0].desc
						this.createTime =res.data.article[0].createTime
						this.content = res.data.article[0].content
						this.lastEditTime = res.data.article[0].lastEditTime
						this.tags = res.data.article[0].tags
						this.$nextTick(() => {
							Array.from(this.$refs.articleBody.querySelectorAll('h2,h4')).forEach((item, index) => {
								item.id = item.innerText;
								this.catalog.push({
									tagName: item.tagName,
									text: item.innerText,
									id: '#' + item.innerText,
								});
								this.domScrollTop.push(item.offsetTop - 100);
							})
							this.scroll()
						});
					// console.log(res.data)
					}else{
						// this.$router.push("/404")
						this.$message.error("请刷新重试")
					}
				}, (err) => {
					if(err.response.status=404)
						this.$router.push("/404")
					else if(err.response.status=500)
						this.$message.error("服务器错误")
					else 
						this.$message.error("未知错误")
					console.log(err)
				})
			}
		},
		beforeMount() {
			this.id=this.$route.params.id;
			this.getArticle();
			if(window.innerWidth<900){
				this.asideStatus = 'mobile'
				this.isMobile = true
			}
		},
		computed:{
			compiledMarkdown () {
				return marked(this.content);
			}
		}
	}
</script>

<style lang="stylus" scoped>
#main
	display flex
	justify-content center
	align-items center
	min-height 100%
	// background #fff
	aside
		position fixed
		overflow-y: auto
		width 250px
		align-self flex-start
		top 0
		left 0
		overflow-y: auto
		box-shadow 1px 1px 3px rgba(0,0,0,0.25)
		background #fff
		// padding-left 15px
		height 100%
		z-index 900
		@media screen and (max-width: 900px)
			box-shadow 0 0 15px rgba(0,0,0,0.2)
		#me
			height 30%
			.sth
				height 75%
				font-size 35px
				// border 1px solid #999
				box-shadow 0 0 3px #666 
				padding-top 15%
				padding-left 30px
			.avatar
				border 0.1px solid #666
				background #fff
				width 50px
				height 50px
				padding 2px
				position relative
				left 180px
				top -33px
				z-index 100
		#catalog-header
			text-align center
			font-size 1.4rem
			margin-top 15px
			padding 5px 0
		#catalog-box
			margin 0 20px
			ul
				li
					a
						font-size 1rem
						color #7f8c8d
						cursor pointer
					a:active
						color #34495e
						font-weight 600
					.catalogLink-active
						color #34495e
						font-weight 600
					.h2
						padding-left 20px
					.h4
						padding-left 45px
	#overlay
		position fixed
		left 250px
		top 0
		height 100%
		width calc(100% - 250px)
		background rgba(253,253,253,0.2)
		z-index 900
	#article-box
		margin-left 250px
		width 65%
		// background #fff
		@media screen and (max-width: 900px)
			width 80%
			margin-left 0
			animation none
		@media screen and (max-width: 600px)
			width 85%
			margin-left 5px !important
		article
			display flex
			justify-content center
			flex-direction column
			#title
				font-size 1.8rem
				font-weight 600
			#time
				color: #7f8c8d;
				font-weight 400
				font-size 1rem
			.tag-list
				.tag
					opacity 0.8
					padding-right 10px
					font-size 1.15rem
					:hover
						color #000
.el-icon-back
	position fixed
	bottom 20px
	left 10px
	font-weight 900
	font-size 20px
	cursor pointer
	z-index 999
	@media screen and (max-width: 600px)
		left 2px
.hide
	animation leave .4s
	transform translate(-100%,0)
	box-shadow none !important
.show
	animation enter .4s
	transform translate(0,0)
.mobile
	transform translate(-100%,0)
	box-shadow none !important
.buttonToShow
	animation buttonToShow .4s
	transform rotate(-180deg)
.buttonToHide
	animation buttonToHide .4s
	transform rotate(0deg)
.mobileButton
	transform rotate(-180deg)
.longHeader
	animation longenHeader .4s
.shortHeader
	animation shortenHeader .4s
.leftArticle
	margin-left 0 !important
	animation leftArticle .4s
.rightArticle
	// margin-left 0 !important
	animation rightArticle .4s
@keyframes leave{
	from{transform:translate(0,0)}
}
@keyframes enter{
	from{transform:translate(-100%,0)}
}
@keyframes buttonToShow{
	from{transform:rotate(0)}
}
@keyframes buttonToHide{
	from{transform:rotate(-180deg)}
}
@keyframes longenHeader{
	from{
		width: calc(100% - 265px)
    margin-left: 265px
	}
}
@keyframes shortenHeader{
	from{
		width: 100%
    margin-left: 0
	}
}
@keyframes leftArticle{
	from{margin-left: 250px}
}
@keyframes rightArticle{
	from{margin-left: 0}
}
</style>