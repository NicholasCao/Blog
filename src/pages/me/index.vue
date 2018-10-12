<template>
	<div>
		<header>
			<h1>Nicholas</h1>
		</header>
		<main>
			<el-menu
				default-active="2"
				class="el-menu-vertical-demo"
				style="width:105px;border:0"
				background-color="#232A2E"
				text-color="#C8C8C8"
				active-text-color="#4690DD"
			>
				<el-menu-item index="1" style="padding-left:5px;font-size:0.8rem" @click="toggleTab('newArticle')">
					<i class="el-icon-edit-outline"></i>
					<span slot="title">新建文章</span>
				</el-menu-item>
				<el-menu-item index="2" style="padding-left:5px;font-size:0.8rem" @click="toggleTab('manageArticle')" id="manageArticleNav">
					<i class="el-icon-tickets"></i>
					<span slot="title">文章管理</span>
				</el-menu-item>
				<el-menu-item index="3" style="padding-left:5px;font-size:0.8rem" @click="toggleTab('editAbout')" disabled>
					<i class="el-icon-setting"></i>
					<span slot="title">About</span>
				</el-menu-item>
			</el-menu>
			<keep-alive>
				<newArticle :is="currentTab" style="width:100%" v-on:reload="reload"></newArticle>
			</keep-alive>
		</main>
	</div>
</template>

<script>
	import newArticle from "../../components/newArticle";
	import manageArticle from "../../components/manageArticle";
	import editAbout from "../../components/editAbout";
	export default {
		inject: ["reload"],
		data () {
			return {
				currentTab: "manageArticle"
			};
		}, 
		components: {
			newArticle,
			manageArticle,
			editAbout
		},
		methods:{
			toggleTab (tag){
				this.currentTab = tag;
			}
		},
		beforeMount() {
			document.title = `me - Nicholas's Blog`
		},
		updated() {
		},
		computed:{
		}
	}
</script>

<style lang="stylus" scoped>
	header
		padding 15px
		background rgb(35,42,46)
		// #545c64
		// rgb(251,251,251)
		// border-bottom 0.9px solid #8C8E8D
		h1
			font-size 1.1rem
			font-weight 500
			color #fff
	main 
		background rgb(243,243,243)
		width 100%
		// height 500px
		display flex
</style>