<template>
	<div>
		<navHeader></navHeader>
		<main>
			<h1>Tags-{{Tags.length}}</h1>
			<ul>
				<li v-for="tag in Tags">
					<router-link :to="'/Tags/'+tag">{{tag}}</router-link>
				</li>
			</ul>
		</main>
		<scollbtn></scollbtn>
		<v-footer></v-footer>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				Tags:[
				]
			};
		},
		methods:{
			getTags(){
				this.$http.get("/api/tags")
				.then((res) => {
					if(res.status == 200){
					this.Tags = res.data.tags;
					}else{
					console.log("err");
					}
				}, (err) => {
					console.log(err);
				})
			}
		},
		created(){
			this.getTags();
			document.title = 'Tags - Nicholas\'s Blog'
		}
	}
</script>


<style lang="stylus" scoped>
main
	display flex
	justify-content center
	flex-direction column
	align-items center
	width 400px
	margin 10px auto
	@media screen and (max-width: 768px)
		width auto
	h1
		margin 20px 0 25px 0
	ul
		display flex
		flex-direction row
		align-items center
		flex-wrap wrap
		li
			margin 5px 10px
			a	
				font-size 1.2rem
				color #1b99ea
			:hover
					color #ff7242!important
</style>