const express = require('express');

const router = express.Router();
const { postController } = require('../controllers/post');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

// App API
router.get('/filter', authMiddleware([ROLES.USER]), postController.filterPosts);

// CRUD API
router.get('/', authMiddleware([ROLES.ADMIN]), postController.getPosts);
router.post('/', authMiddleware([ROLES.ADMIN]), postController.createPost);
router.put('/', authMiddleware([ROLES.ADMIN]), postController.updatePost);
router.get('/:postid', authMiddleware([ROLES.ADMIN]), postController.getPostById);
router.delete('/:postid', authMiddleware([ROLES.ADMIN]), postController.deletePost);

module.exports = router;
