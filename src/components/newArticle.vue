<template>
  <div id="new-article-box">
    <div style="padding:20px">
      <div id="title-box">
        <span class="input-name">文章标题:</span>
        <el-input	placeholder="" style="width:230px" size="small" v-model="title" clearable>
        </el-input>
      </div>
      <div id="tags-box">
        <span class="input-name">文章标签:</span>
        <el-input	placeholder="按回车添加标签" style="width:230px" size="small" v-model="tag" clearable @keyup.enter.native="addTag">
        </el-input>
        <el-tag
          :key="tag"
          v-for="tag in tags"
          closable
          @close="deleteTag(tag)">
          {{tag}}
        </el-tag>
      </div>
      <div id="desc-box">
        <span class="input-name">文章描述:</span>
        <el-input	type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="" style="width:65%;margin-left:5px" size="small" v-model="desc">
        </el-input>
      </div>
      <div id="content-box">
        <span class="input-name">文章内容:</span>
        <div id="simplemde-box">
          <textarea id="simplemde"></textarea>
        </div>
      </div>
      <div id="button-box">
        <el-button @click="addArticle(false)" style="width:98px">新建草稿</el-button>
        <el-button @click="addArticle(true)" style="width:98px">发布文章</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import SimpleMDE from "simplemde";
  import marked from "../lib/marked.js";
  import css from "simplemde/dist/simplemde.min.css";
  let simplemde;
	export default {
		data () {
			return {
				title: "",
				tags: [],
				tag: "",
				desc: "",
        content:""
				// publish: "true" 
			};
		},
		methods:{
			addTag (){
				this.tags.push(this.tag)
				this.tag=""
			},
      addArticle (isPublish){
        let article={
          title: this.title,
          tags: this.tags,
          desc: this.desc,
          content: simplemde.value(),
          publish: isPublish
        }
        this.$http.post("/admin/article", article) // 新增创建请求
          .then((res) => {
            if(res.status == 200){ // 当返回的状态为200成功时
              this.$message({
                type: "success",
                message: "新建文章成功！" 
              })
              this.$emit("reload")
            }else{
              this.$message.error("新建文章失败！") // 当返回不是200说明处理出问题
            }
          }, (err) => {
            this.$message.error("新建文章失败！") // 当没有返回值说明服务端错误或者请求没发送出去
            console.log(err)
          })
      },
      reset(){
        this.title="";
				this.tags= [];
				this.tag= "";
				this.desc= "";
        this.content= "";
        simplemde.value("");
      },
      deleteTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
		},
		mounted() {
      simplemde = new SimpleMDE({
        autoDownloadFontAwesome: false,
        element: document.getElementById("simplemde"),
        spellChecker: false,
        previewRender: function (plainText) {
            return marked(plainText); // Returns HTML from a custom parser
        },
      });
		},
		computed:{
		}
	}
</script>
<style lang="stylus" scoped>
div#new-article-box
  background #fff
  margin 10px
  width 100%
  span.input-name
    font-size 0.9rem
    padding 0 10px
  #title-box
  #tags-box
  #desc-box
  #content-box
  #button-box
    margin 10px
    margin-bottom 20px
  #button-box
    margin-left 96px
  #desc-box
  #content-box
    display flex
    #simplemde-box
      margin-left 5px
      width 65%

.el-tag 
  margin-left 10px
</style>