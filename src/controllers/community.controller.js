import * as communityService from '../services/community.service.js';

export const createPost = async (req, res, next) => {
    try {
        const post = await communityService.createPost(req.user.id, req.body);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await communityService.getPosts(page, limit);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const post = await communityService.getPostById(req.params.id);
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const post = await communityService.updatePost(req.params.id, req.user.id, req.user.role, req.body);
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        await communityService.deletePost(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const addComment = async (req, res, next) => {
    try {
        const comment = await communityService.addComment(req.user.id, req.params.postId, req.body);
        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        next(error);
    }
};

export const replyToComment = async (req, res, next) => {
    try {
        const reply = await communityService.replyToComment(req.user.id, req.params.commentId, req.body);
        res.status(201).json({ success: true, data: reply });
    } catch (error) {
        next(error);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const comment = await communityService.updateComment(req.params.commentId, req.user.id, req.user.role, req.body);
        res.status(200).json({ success: true, data: comment });
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        await communityService.deleteComment(req.params.commentId, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        next(error);
    }
};