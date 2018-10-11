<template>
	<div>
		<navHeader></navHeader>
		<div id="article-box">
			<article>
				<h1 id="title">{{title}}</h1>
				<h4 id="time">
					{{createTime}}
				</h4>
				<div class="tag-list" style="margin: 20px 0;">
					<span class="tag" v-for="tag in tags">
						<router-link :to="'/Tags/'+tag" >
							<span>{{tag}}</span>
						</router-link>
					</span>
				</div>
				<div v-html="compiledMarkdown" id="markdown-content">
				</div>
			</article>
		</div>
		<scollbtn></scollbtn>
		<v-footer></v-footer>
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
			};
		},
		methods:{
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
		mounted() {
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
#article-box
	display flex
	justify-content center
	align-items center
	article
		margin 0 auto
		width 55%
		display flex
		justify-content center
		flex-direction column
		@media screen and (max-width: 800px)
			width 80%
		@media screen and (max-width: 500px)
			width 90%
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