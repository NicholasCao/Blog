<template>
	<div id="manage-box">
		<div id="filter-box">
			<div id="tag-filter">
				<span>标签:</span>
				<el-radio-group v-model="tagFilter" size="small" fill="#000">
					<el-radio-button label="全部" ></el-radio-button>
					<el-radio-button v-for="tagLabel in allTags" :label="tagLabel" :key="tagLabel" style="margin-top: 5px"></el-radio-button>
				</el-radio-group>
			</div>
			<div id="publish-filter">
				<span>状态:</span>
				<el-radio-group v-model="publishFilter" size="small" fill="#000">
					<el-radio-button label="全部" ></el-radio-button>
					<el-radio-button label="发布"></el-radio-button>
					<el-radio-button label="草稿"></el-radio-button>
				</el-radio-group>
			</div>
		</div>
		<div id="manage-article-box">
			<el-table
				:data="currentArticleList"
				border
				style="width:869px"
				:default-sort = "{prop: 'date', order: 'null'}"
				:header-cell-style="{background: 'rgb(241,241,241)'}"
			>
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" inline class="table-expand">
							<el-form-item label="_id ">
								<span>{{ props.row._id}}</span>
							</el-form-item>
							<el-form-item label="标签">
								<span>{{ props.row.tags }}</span>
							</el-form-item>
							<el-form-item label="描述">
								<span>{{ props.row.desc }}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column prop="title" label="文章标题" width="300">
				</el-table-column>
				<el-table-column
					prop="lastEditTime"
					label="修改时间"
					sortable
					width="220"
					align="center">
				</el-table-column>
				<el-table-column label="发布" width="120" align="center">
					<div slot-scope="scope">
						<el-switch
							v-model="scope.row.publish"
							active-color="#13ce66"
							@change = "changePublish(scope.$index,scope.row)"
						>
						</el-switch>
					</div>
				</el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<div slot-scope="scope">
						<el-button-group>
							<el-button type="primary"	icon="el-icon-edit" size="mini" style="width:48px"
								@click="editArticle(scope.$index, scope.row)"></el-button>
							<el-button type="danger" icon="el-icon-delete" size="mini" style="width:48px"
								@click="deleteArticle(scope.$index, scope.row)"></el-button>
						</el-button-group>
					</div>
				</el-table-column>
			</el-table>
		</div>
		<div id="edit-article-box" v-if="showEditBox">
			<div id="box-bg">
				<el-button icon="el-icon-close" circle id="close-box" @click="closeBox" style="width:38px;margin:0"></el-button>
				<div id="edit">
					<div style="padding:20px">
						<div id="title-box">
							<span class="input-name">文章标题:</span>
							<el-input	placeholder="" style="width:230px" size="small" v-model="currentTitle" clearable>
							</el-input>
						</div>
						<div id="tags-box">
							<span class="input-name" style="padding-right:0">文章标签:</span>
							<el-tag
								:key="tag"
								v-for="tag in currentTags"
								closable
								@close="deleteTag(tag)">
								{{tag}}
							</el-tag>
							<el-input
								class="input-new-tag"
								v-if="inputVisible"
								v-model="inputTag"
								ref="saveTagInput"
								size="small"
								@keyup.enter.native="handleInputConfirm"
								@blur="handleInputConfirm"
							>
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput" style="width:78.69px">New Tag</el-button>
						</div>
						<div id="desc-box" style="display:flex">
							<span class="input-name">文章描述:</span>
							<el-input	type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="" style="width:85%;margin-left:5px" size="small" v-model="currentDesc">
							</el-input>
						</div>
						<div id="content-box" style="display:flex">
							<span class="input-name">文章内容:</span>
							<div id="simplemde-box">
								<textarea id="editContent"></textarea>
							</div>
						</div>
						<div id="button-box" style="margin-left :96px">
							<el-button @click="saveArticle" style="width:70px">保存</el-button>
						</div>
					</div> 
				</div>
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
		inject: ["reload"],
		data () {
			return {
				articleList:[],
				currentArticleList:[],
				tagFilter: "全部",
				publishFilter: "全部",
				allTags: [],
				filterTimes: 0,
				showEditBox: false,
				currentId: 0,
				currentTitle: "",
				currentTags: [],
				currentDesc: "",
				currentContent: "",
				title: "",
				// tags: [],
				tagChanged: false,
				desc: "",
				content: "",
				inputVisible: false,
        inputTag: "",
				isEdit: false,
				saved: false,
			};
		},
		watch: {
			tagFilter: function (){
				this.getCurrentArticleList();
			},
			publishFilter: function (){
				this.getCurrentArticleList();
			},
		},
		methods: {
			getAllArticles(){
				this.$http.get("/admin/article")
				.then((res) => {
					if(res.status == 200){
						this.currentArticleList = res.data.articleList;
						// console.log(res.data)
					}else{
					console.log("err");
					}
				}, (err) => {
					console.log(err);
				})
			},
			getAllTags(){
				this.$http.get("/admin/tag")
				.then((res) => {
					if(res.status == 200){
						this.allTags = res.data.tags;
					}else{
					console.log("err");
					}
				}, (err) => {
					console.log(err);
				})
			},
			getCurrentArticleList(){
				if(!this.filterTimes)this.articleList = this.currentArticleList;
				if(this.publishFilter == "全部" && this.tagFilter == "全部"){
					this.currentArticleList=this.articleList
				}
				else if(this.tagFilter == "全部"){
					this.currentArticleList=this.articleList
						.filter((article)=>article.publish==(this.publishFilter=="发布"?true : false));
				}
				else if(this.publishFilter == "全部"){
					this.currentArticleList=this.articleList
						.filter((article)=>article.tags.indexOf(this.tagFilter)!=-1);
				}
				else {
					this.currentArticleList=this.articleList
					.filter((article)=>article.publish==(this.publishFilter=="发布"?true : false))
					.filter((article)=>article.tags.indexOf(this.tagFilter)!=-1);
				}
				this.filterTimes++;
			},
			changePublish(index,article){
				article.changePublish= true;
				if(article.publish){
					this.modifyArticle(article,"发布");
				}
				else{
					this.modifyArticle(article,"撤回");
				}
			},
			editArticle(index,article){
				this.showEditBox=true;
				showBox();
				this.isEdit = false;
				this.saved = false;
				this.currentId = article._id;
				this.$http.get("/api/article/"+this.currentId) 
					.then((res) => {
						if(res.status == 200){
							this.currentTitle = res.data.article[0].title
							this.currentDesc = res.data.article[0].desc
							this.createTime =res.data.article[0].createTime
							this.currentContent = res.data.article[0].content
							simplemde.value(this.currentContent);
							this.currentTags = res.data.article[0].tags
							this.title = res.data.article[0].title
							this.desc = res.data.article[0].desc
							this.content = res.data.article[0].content
						}else{
							this.$message.error("sth wrong");
						}
					}, (err) => {
						console.log(err);
						this.$message.error("sth wrong");
					})
			},
			saveArticle(){
				let article={
					_id: this.currentId,
					title: this.currentTitle,
					tags: this.currentTags,
					desc: this.currentDesc,
					content: simplemde.value()
				};
				this.modifyArticle(article,"保存")
			},
			closeBox(){
				if((this.title !=this.currentTitle||this.tagChanged||this.desc !=this.currentDesc||this.content != simplemde.value())&&!this.saved){
					this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '保存',
						cancelButtonText: '放弃修改'
					})
						.then(() => {
							this.saveArticle();
							hideBox();
							this.showEditBox=false;
							// this.reload();
						})
						.catch(action => {
							if(action === 'cancel' ){
								hideBox();
								this.showEditBox=false;
								// this.reload();
							}
						});
				}
				else {
					hideBox();
					this.showEditBox=false;
				}
				this.tagChanged = false;
			},
			deleteTag(tag) {
        this.currentTags.splice(this.currentTags.indexOf(tag), 1);
				this.tagChanged = true;
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputTag = this.inputTag;
        if (inputTag) {
          this.currentTags.push(inputTag);
					this.tagChanged = true;
        }
        this.inputVisible = false;
        this.inputTag = "";
      },
			modifyArticle(article,operation){
				this.$http.patch("/admin/article/"+ article._id,article).then((res) => {
						if(res.status == 200){
							this.$message({
								type: "success",
								message: "文章"+operation+"成功！"
							});
							if(operation=="保存")this.saved=true;
						}else{
							this.$message.error("文章"+operation+"失败！");
						}
					}, (err) => {
						this.$message.error("文章"+operation+"失败！");
						console.log(err);
					})
			},
			deleteArticle(index,article){
				this.$confirm("是否确定删除该文章", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
          // type: "warning"
        }).then(() => {
					this.$http.delete("/admin/article/"+ article._id).then((res) => {
						if(res.status == 200){
							this.$message({
								type: "success",
								message: "文章删除成功！"
							})
							this.reload();
						}else{
							this.$message.error("文章删除失败！")
						}
					}, (err) => {
						this.$message.error("文章删除失败！")
						console.log(err)
					})
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });          
        });
			}
		},
		updated() {
			if(this.showEditBox && !this.isEdit){
				simplemde = new SimpleMDE({
					autoDownloadFontAwesome: undefined,
					element: document.getElementById("editContent"),
					spellChecker: false,
					previewRender: function (plainText) {
							return marked(plainText); // Returns HTML from a custom parser
					},
				});
				// simplemde.value(this.currentContent);
				this.isEdit = true;
			}
		},
		mounted() {
		},
		created(){
			this.getAllArticles();
			this.getAllTags();
		}
	}
</script>
<style lang="stylus" scoped>

#filter-box
	background #fff
	margin 10px
	padding 10px 15px
	// width 100%
	#tag-filter
	#publish-filter
		padding 10px 5px
		border-bottom 1px dashed rgb(241, 241, 241)
		span 
			font-size 0.8rem
			padding-right 5px
#manage-article-box
	background #fff
	margin 10px
	padding 10px 15px
	// width 100%

.el-form-item
	margin-right 0
	margin-bottom 0
	width 100%

#edit-article-box
#box-bg
	position fixed
	top 0
	left 0
	width 100%
	height 100%
	#close-box
		position fixed
		right 2px
		top 2px
		background rgb(42,42,42)
		border 0
		color rgb(202,202,202)

#edit-article-box
	z-index 999
	#box-bg
		background rgba(0,0,0,0.8)
		display flex
		justify-content center
		align-items center
		#edit
			height 80%
			width 70%
			background #fff
			overflow-y auto
			span.input-name
				font-size 0.9rem
				padding 0 10px
			#title-box
			#tags-box
			#desc-box
			#button-box
			#content-box
				margin 10px
				margin-bottom 20px
				#simplemde-box
					margin-left 5px
					width 85%
// #box-bg
	// opacity .87
	// background #1e1e1e
	// background rgba(0,0,0,0.8)
	// display none

.el-tag 
	margin 0 0 5px 10px
.button-new-tag 
	margin-left 10px
	height 32px
	line-height 30px
	padding-top 0
	padding-bottom 0
.input-new-tag 
	width 90px
	margin-left 10px
	vertical-align bottom

</style>