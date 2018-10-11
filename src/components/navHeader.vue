<template>
  <div id="header-box">
    <header>
      <span id="site-name">
        <router-link to="/">Nicholas's Blog</router-link>
      </span>
      <nav id="nav">
        <ul class="nav-link-container">
          <li>
            <a href="http://nicholasc.cn">Home</a>
          </li>
          <li>
            <router-link to="/">Articles</router-link>
          </li>
          <li>
            <router-link to="/Tags">Tags</router-link>
          </li>
        </ul>
        <el-dropdown trigger="click">
          <span class="menu-button">
            <i class="el-icon-menu" style="font-size:24px"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><a href="http://nicholasc.cn" style="font-size:1.1rem">Home</a></el-dropdown-item>
            <el-dropdown-item><router-link to="/" style="font-size:1.1rem">Articles</router-link></el-dropdown-item>
            <el-dropdown-item><router-link to="/Tags" style="font-size:1.1rem">Tags</router-link></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </nav>
    </header>

  </div>
</template>

<script>
export default {
  name: "navHeader",
  data () {
    return {
    }
  },
  methods:{
  }
}
</script>

<style lang="stylus" scoped>  
#header-box
  @media screen and (max-width: 480px)
    height 70px
  header
    z-index 999
    padding 20px 0 0 40px
    box-shadow 0 0 3px rgba(0,0,0,0.25)
    -webkit-box-shadow 0 0 3px rgba(0,0,0,0.25)
    background #fff
    margin-bottom 50px
    #site-name
      @media screen and (max-width: 480px)
        display inline-block
        margin-bottom 10px
        position relative
        top -6px
        left -25px
      a
        font-size 20px
      :hover 
        color #000
  #nav
    width 100%
    display flex
    flex-direction row
    justify-content flex-end
    @media screen and (max-width: 480px)
      position absolute
      right 0
      top 15px
    .nav-link-container
      position relative
      display flex
      flex-direction row
      justify-content flex-end
      padding 0 40px 7px
      background none
      border-bottom none
      @media screen and (max-width: 480px)
        &
          display none
      li
        font-size 15px
        font-size 1rem
        position relative
        display inline-block
        padding 0 50px 0 0
        background none
        border-bottom none
    .menu-button
      position relative
      right 10px
      top 10px
      display none
      @media screen and (max-width: 480px)
        display block

</style>
