<template>
	<div>
		<navHeader></navHeader>
		<main>
			<h1>404</h1>
		</main>
		<scollbtn></scollbtn>
		<v-footer></v-footer>
	</div>
</template>

<script>
	export default {
		data () {
			return {

			};
		},
		methods:{

		},
		mounted() {
			document.title= '404'
		},
		computed:{
		}
	}
</script>

<style lang="stylus" scoped>
	main
		display flex
		justify-content center
		align-items center
		h1
			font-size 10rem
			font-weight 500
</style>