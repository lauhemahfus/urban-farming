import { z } from 'zod';

export const createPostSchema = z.object({
    body: z.object({
        postContent: z.string().min(1, 'Post content is required'),
        tags: z.string().optional(),
    }),
});

export const updatePostSchema = z.object({
    body: z.object({
        postContent: z.string().min(1, 'Post content is required').optional(),
        tags: z.string().optional(),
    }),
});

export const createCommentSchema = z.object({
    body: z.object({
        content: z.string().min(1, 'Comment content is required'),
        parentId: z.string().uuid('Invalid parent ID format').optional(),
    }),
});

export const replyCommentSchema = z.object({
    body: z.object({
        content: z.string().min(1, 'Reply content is required'),
    }),
});

export const updateCommentSchema = z.object({
    body: z.object({
        content: z.string().min(1, 'Comment content is required'),
    }),
});
