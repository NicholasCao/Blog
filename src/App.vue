<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: "App",
    provide (){
      return{
        reload: this.reload
      }
    },
    data (){
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload (){
        this.isRouterAlive = false;
        this.$nextTick(function (){
          this.isRouterAlive = true;
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import "./stylus/_normalize.styl"
  @import "./stylus/common.styl"
  @import "./stylus/index.styl"
</style>
