<template>
  <footer id="footer">
    <div>
      <p>
        <a href="http://www.miitbeian.gov.cn">粤ICP备18098505号</a>
      </p>
      <p class="copyright">
        Copyright © 2018 <a href="https://github.com/NicholasCao">Nicholas.</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus" scoped>  
  #footer
    width 70%
    margin 80px auto 0
    div
      border-top 1px solid #e5e5e5
      a:hover
        color #000
      p
        font-size 14px
        text-align center
        padding 5px 0
        color #222
      .copyright
        font-size 15px

</style>
