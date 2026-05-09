const express = require('express');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', authMiddleware.tokenVerification, postController.createPosts);
router.get('/',authMiddleware.tokenVerification, postController.getPosts);
router.get('/my-posts', authMiddleware.tokenVerification, postController.myPosts);
router.delete('/:id', authMiddleware.tokenVerification, postController.deletePost);
router.patch('/:id', authMiddleware.tokenVerification, postController.updatePost);
router.post('/:id/like', authMiddleware.tokenVerification, postController.toggleLike);

router.post('/:postId/comments', tokenVerification, createComment);
router.get('/:postId/comments', tokenVerification, getComments);