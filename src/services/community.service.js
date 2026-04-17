import { db as prisma } from '../config/prisma.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const createPost = async (userId, data) => {
    return prisma.communityPost.create({
        data: {
            userId,
            postContent: data.postContent,
            tags: data.tags
        }
    });
};

export const getPosts = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
        prisma.communityPost.findMany({
            where: { isDeleted: false },
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
                _count: { select: { comments: { where: { isDeleted: false } } } }
            }
        }),
        prisma.communityPost.count({ where: { isDeleted: false } })
    ]);

    return { posts, total, page: Number(page),
        totalPages: Math.ceil(total / Number(limit)) };
};

export const getPostById = async (postId) => {
    const post = await prisma.communityPost.findFirst({
        where: { id: postId, isDeleted: false },
        include: {
            user: { select: { id: true, name: true, email: true } },
            comments: {
                where: { isDeleted: false, parentId: null },
                include: {
                    user: { select: { id: true, name: true } },
                    replies: {
                        where: { isDeleted: false },
                        include: {
                            user: { select: { id: true, name: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!post) {
        throw new NotFoundError('Post not found');
    }

    return post;
};

export const updatePost = async (postId, userId, role, data) => {
    const post = await prisma.communityPost.findFirst({
        where: { id: postId, isDeleted: false }
    });

    if (!post) {
        throw new NotFoundError('Post not found');
    }

    if (post.userId !== userId && role !== 'admin') {
        throw new BadRequestError('You do not have permission to update this post');
    }

    return prisma.communityPost.update({
        where: { id: postId },
        data
    });
};

export const deletePost = async (postId, userId, role) => {
    const post = await prisma.communityPost.findFirst({
        where: { id: postId, isDeleted: false }
    });

    if (!post) {
        throw new NotFoundError('Post not found');
    }

    if (post.userId !== userId && role !== 'admin') {
        throw new BadRequestError('You do not have permission to delete this post');
    }

    return prisma.communityPost.update({
        where: { id: postId },
        data: { 
            isDeleted: true,
            deletedAt: new Date()
        }
    });
};

export const addComment = async (userId, postId, data) => {
    const post = await prisma.communityPost.findFirst({
        where: { id: postId, isDeleted: false }
    });

    if (!post) {
        throw new NotFoundError('Post not found');
    }

    if (data.parentId) {
        const parentComment = await prisma.comment.findFirst({
            where: { id: data.parentId, postId, isDeleted: false }
        });
        
        if (!parentComment) {
            throw new NotFoundError('Parent comment not found');
        }
    }

    return prisma.comment.create({
        data: {
            userId,
            postId,
            content: data.content,
            parentId: data.parentId || null
        }
    });
};

export const replyToComment = async (userId, parentCommentId, data) => {
    const parentComment = await prisma.comment.findFirst({
        where: { id: parentCommentId, isDeleted: false },
        include: { post: true }
    });

    if (!parentComment) {
        throw new NotFoundError('Parent comment not found');
    }

    if (parentComment.post.isDeleted) {
        throw new BadRequestError('Cannot reply to a comment on a deleted post');
    }

    return prisma.comment.create({
        data: {
            userId,
            postId: parentComment.postId,
            content: data.content,
            parentId: parentCommentId
        }
    });
};

export const updateComment = async (commentId, userId, role, data) => {
    const comment = await prisma.comment.findFirst({
        where: { id: commentId, isDeleted: false }
    });

    if (!comment) {
        throw new NotFoundError('Comment not found');
    }

    if (comment.userId !== userId && role !== 'admin') {
        throw new BadRequestError('You do not have permission to update this comment');
    }

    return prisma.comment.update({
        where: { id: commentId },
        data: { content: data.content }
    });
};

export const deleteComment = async (commentId, userId, role) => {
    const comment = await prisma.comment.findFirst({
        where: { id: commentId, isDeleted: false }
    });

    if (!comment) {
        throw new NotFoundError('Comment not found');
    }

    if (comment.userId !== userId && role !== 'admin') {
        throw new BadRequestError('You do not have permission to delete this comment');
    }

    return prisma.comment.update({
        where: { id: commentId },
        data: { 
            isDeleted: true,
            deletedAt: new Date()
        }
    });
};