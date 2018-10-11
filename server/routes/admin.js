const admin = require("../controllers/admin.js"),
  router = require("koa-router")();

router.post("/login",admin.login)
  .get("/article",admin.getAllArticles)
  .get("/tag",admin.getAllTags)
  .post("/article",admin.addArticle)
  .delete("/article/:id", admin.deleteArticle)
  .patch("/article/:id", admin.modifyArticle);
module.exports = router;