<template>
	<div :class="show?'scoll-show':'scoll-hide'">
		<router-link to="" id="scoll-btn" @click.native="jump ()">Top</router-link>
	</div>

</template>
<script>
export default {
  name: "scollbtn",
	data() {
    return {
			show:false
    }
  },
	methods:{
    jump () {
      let jump = document.querySelector("#header-box");
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
    }
	},
	mounted () {
  	window.addEventListener("scroll", ()=> {
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			if(scrollTop>300){
				this.show=true;
			}
			else this.show=false;
		})
	}
}
</script>
<style lang="stylus" scoped>  
	.scoll-hide
		display none
	.scoll-show
		display flex
		justify-content flex-end
		position fixed
		right 0
		bottom 25%
		animation showBtn .5s
	#scoll-btn
		display block
		height 2.5rem
		width 2.5rem
		overflow hidden
		text-indent -1000%
		box-shadow 0 2.5px 5px 0 rgba(0,0,0,.14)
		background url("../assets/up.png") center center no-repeat
		background-color #fff
		margin 5px
		border-radius 3px
@keyframes showBtn
{
from {opacity: 0;}
to {opacity: 1;}
}

</style>