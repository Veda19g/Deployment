const Post = require('../models/Post.Model');

const createPost = async (req, res) => {
    const userId = req.userId; 
    try {
        const { content } = req.body;
        

        const newPost = new Post({ user: userId, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name email').populate('comments.user', 'name');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const likePost = async (req, res) => {
    const userId = req.userId;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addComment = async (req, res) => {
    const userId = req.userId;
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ user: userId, text });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePost = async (req, res) => {
    const userId = req.userId;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createPost, getPosts, likePost, addComment, deletePost };