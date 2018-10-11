import Vue from "vue"
import Router from "vue-router"
// import HelloWorld from "@/components/HelloWorld"

import home from "../pages/home"
import article from "../pages/article"
import tags from "../pages/tags"
import tag from "../pages/tag"
import _404 from "../pages/404"
import login from "../pages/login"
import me from "../pages/me"

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/Article/:id",
      name: "article",
      component: article
    },
    {
      path: "/Tags",
      name: "tags",
      component: tags
    },
    {
      path: "/Tags/:tag",
      name: "tag",
      component: tag
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/me",
      name: "me",
      component: me
    },
    {
      path: "*",
      name: "404",
      component: _404
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to,from,next) =>{
  const token = sessionStorage.getItem("blog-token");
  if(to.path == "/login"){ // 如果是跳转到登录页的
    if(token != "null" && token != null){
      next("/me") // 如果有token就转向me不返回登录页
    }
    next(); // 否则跳转回登录页
  }else if(to.path == "/me"){
    if(token != "null" && token != null){
      // 全局设定header的token验证，注意Bearer后有个空格
      Vue.prototype.$http.defaults.headers.common["Authorization"] = "Bearer " + token;
      next();// 如果有token就正常转向
    }else{
      next("/login") // 否则跳转回登录页
    }
  }else{
    next();
  }
})

export default router;