const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/create', postController.create);

router.post('/:postId/tags/add', postController.tagAdd);
router.post('/:postId/tags/:tagId', postController.tagEdit);
router.get('/:postId/tags/delete/:tagId', postController.tagDel);
router.post('/search', postController.search);

module.exports = router;
