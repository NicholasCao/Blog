<template>
	<div>
		<navHeader></navHeader>
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
		<scollbtn></scollbtn>
		<v-footer></v-footer>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				articleList:[
				]
			};
		},
		methods:{
			getArticleList(){
				this.$http.get("/api/article")
				.then((res) => {
					if(res.status == 200){
						this.articleList = res.data.articleList;
					// console.log(res.data)
					}else{
					console.log("err");
					}
				}, (err) => {
					console.log(err);
				})
			}
		},
		beforeMount() {
			this.getArticleList();
		}
	}
</script>


<style lang="stylus" scoped>
	#article
		display flex
		justify-content center
		align-items center
		#article-box
			width 45%
			display flex
			flex-direction column
			@media screen and (max-width: 700px)
				width 80%
			@media screen and (max-width: 500px)
				width 90%
			.article-item
				width 100%
				position relative
				display flex
				justify-content space-between
				align-items center
				padding 1.5rem 0 1rem
				flex-direction column
				.title
					width 100%
					font-size 1.7rem
					padding 10px 0
					font-weight 600
				.time
					width 100%
					font-size 0.85rem
					padding-left 8px
					span
						color #696969
				.desc
					width 100%
					margin 25px 0
					padding-left 8px
					opacity 0.8
</style>