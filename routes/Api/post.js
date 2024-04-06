const express = require('express');
const router = express.Router();
const postController = require('../../controllers/Api/postController');

// Protected route - create a new post
router.post('/create', postController.create);
router.post('/:postId/tags', postController.tagAdd);
router.post('/:postId/tags/:tagId', postController.tagEdit);
router.post('/tag/delete', postController.tagDel);
router.post('/serch', postController.tagDel);

module.exports = router;
