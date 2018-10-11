<template>
  <main id="main">
    <div id="login-box">
      <span class="title">
        欢迎登录 
      </span>
      <el-input 
        v-model="username" 
        placeholder="账号"
        type="text">
      </el-input>
      <el-input 
        v-model="password" 
        placeholder="密码"
        type="password"
        @keyup.enter.native="loginToDo">
      </el-input>
      <el-button type="primary" @click="loginToDo">登录</el-button>
    </div>
  </main>
</template>

<script>
export default {
  data () {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    loginToDo() {
      let obj = {
        username: this.username,
        password: this.password
      } 
      this.$http.post("/admin/login", obj)
        .then((res) => {
          if(res.data.success){
            sessionStorage.setItem("blog-token",res.data.token); // 用sessionStorage把token存下来
            this.$message({ // 登录成功，显示提示语
              type: "success",
              message: "登录成功！"
            }); 
            this.$router.push("/me")
          }else{
            this.$message.error(res.data.info); // 登录失败，显示提示语
            sessionStorage.setItem("blog-token",null); // 将token清空
          }
        }, (err) => {
            console.log(err)
            this.$message.error("请求错误！")
            sessionStorage.setItem("blog-token",null); // 将token清空
        })
    }
  },
  mounted() {
    document.title = `login`
  },
};
</script>

<style lang="stylus" scoped>
  main#main
    display flex
    flex-direction column
    justify-content center
    align-items center
    height 100%
    div#login-box
      width 300px
      display flex
      flex-direction column
      justify-content center
      align-items center
      margin-top -10%
  .title
    font-size 28px
    display inline-block
  .el-input
    margin 12px 0
  .el-button
    width 100%
    margin-top 12px    
</style>
<style lang="stylus">
  html,body
    height 100%
    #app
      height 100%
</style>