const Koa = require("koa"),
  koaRouter = require("koa-router"),
  json = require("koa-json"), 
  logger = require("koa-logger"),
  api = require("./server/routes/api.js");
  admin = require("./server/routes/admin.js");
  jwt = require("koa-jwt"),
  config =require("./server/config"),
  mongoose =require("mongoose"),
  path =require("path"),
  serve = require("koa-static");
  historyApiFallback = require("koa2-history-api-fallback");


mongoose.connect(config.mongodb.url, config.mongodbSecret);
mongoose.connection.on("error", console.error);
mongoose.connection.on("open", () => console.log("MongoDB connection successed"));

const app = new Koa(),
  router = koaRouter()

app.use(require("koa-bodyparser")());
app.use(json());
app.use(logger());


app.on("error", function(err, ctx){
  console.log("server error", err);
});

router.use("/api",api.routes())
router.use("/admin",jwt({secret: config.jwt.secret}).unless({ path: [/^\/admin\/login/]}),admin.routes())
app.use(router.routes());




// app.use(historyApiFallback()); 
// app.use(serve(path.resolve('dist'))); 

app.listen(3389,() => {
  console.log("Koa is listening in 3389");
});



