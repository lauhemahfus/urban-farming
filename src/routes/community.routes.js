import { Router } from 'express';
import * as communityController from '../controllers/community.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { 
    createPostSchema, 
    updatePostSchema, 
    createCommentSchema, 
    updateCommentSchema,
    replyCommentSchema
} from '../validations/community.validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Community
 *   description: Community posts and comments management
 */

/**
 * @swagger
 * /community/posts:
 *   post:
 *     summary: Create a new community post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postContent
 *             properties:
 *               postContent:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *   get:
 *     summary: Get all community posts
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of posts
 */
router.route('/posts')
    .post(auth, validate(createPostSchema), communityController.createPost)
    .get(communityController.getPosts);

/**
 * @swagger
 * /community/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details
 *   put:
 *     summary: Update a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postContent:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *   delete:
 *     summary: Delete a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.route('/posts/:id')
    .get(communityController.getPostById)
    .put(auth, validate(updatePostSchema), communityController.updatePost)
    .delete(auth, communityController.deletePost);

/**
 * @swagger
 * /community/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               parentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/posts/:postId/comments', auth, validate(createCommentSchema), communityController.addComment);

/**
 * @swagger
 * /community/comments/{commentId}/reply:
 *   post:
 *     summary: Reply to a specific comment
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reply added successfully
 */
router.post('/comments/:commentId/reply', auth, validate(replyCommentSchema), communityController.replyToComment);

/**
 * @swagger
 * /community/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *   delete:
 *     summary: Delete a comment
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.route('/comments/:commentId')
    .put(auth, validate(updateCommentSchema), communityController.updateComment)
    .delete(auth, communityController.deleteComment);

export default router;