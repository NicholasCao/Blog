const article = require('../controllers/article.js');
const router = require('koa-router')();

router.get('/article',article.getArticleList)
	.get('/article/:id', article.getArticleById)
	.get('/tags', article.getTags)
	.get('/tags/:tag', article.getArticleByTag);

module.exports = router;
