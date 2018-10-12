<template>
	<div style="height:100%">
		<navHeader  :isArticle="true"></navHeader>
		<div id="main">
			<aside>
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
							<a :href="item.href" :class="{'h2':item.tagName=='H2','h4':item.tagName=='H4','catalogLink-active':index==activeIndex}">{{item.text}}</a><br/>
						</li>
					</ul>
				</div>
			</aside>
			<div id="article-box">
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
			};
		},
		methods:{
			scroll(){
				window.onscroll = () => {
					var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
					for(var i = this.domScrollTop.length-1 ; i>=0; i--){
						if(scrollTop>this.domScrollTop[i]){
							this.activeIndex = i;
							console.log(i)
							break;
						}
					}
				};
			},
			getArticle(){
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
									href: '#' + item.innerText,
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
	aside
		position fixed
		overflow-y: auto
		width 250px
		align-self flex-start
		top 0
		left 0
		overflow-y: auto
		box-shadow 1px 1px 3px rgba(0,0,0,0.25)
		// padding-left 15px
		height 100%
		@media screen and (max-width: 900px)
			display none
		#me
			height 30%
			// background #000
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
				top -30px
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
	#article-box
		margin-left 250px
		width 65%
		@media screen and (max-width: 900px)
			width 80%
			margin-left 0
		@media screen and (max-width: 600px)
			width 90%
			margin-left 0
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
</style>