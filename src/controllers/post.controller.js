const Post = require('../models/post.model');

const createPosts = async (req, res) => {
    try {
        const {content} = req.body;

        if(!content){
            return res.status(400).json({
                error: "content is required"
            });
        }

        const post = await Post.create({
            content,
            user: req.user.id
        })

        const populatedPost = await post.populate('user', 'name email');

        res.status(201).json({
            message: "Post created successfully",
            post: populatedPost,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Something went wrong"
        })
    }
}

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('user', 'name email');

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

const myPosts = async (req, res) => {
    try {
        const userPosts = await Post.find({user : req.user.id}).sort({ createdAt: -1 });

        if(userPosts.length === 0){
            return res.status(200).json({
                message: "You have not posted anything yet",
                user: []
            });
        }

        return res.status(200).json({
            message: "Post fetched successfully",
            user: userPosts
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                error: "post not found"
            });
        }

        if(post.user.toString() !== req.params.id){
            return res.status(403).json({
                error: "you are not allowed to delete this post"
            });
        }

        await post.findByIdAndDelete(postId);

        return res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const {newContent} = req.body;

        if(!newContent){
            return res.status(400).json({
                error: "Content is required"
            });
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                error: "post not found"
            });
        }

        if(post.user.toString() !== req.user.id){
            return res.status(403).json({
                error: "You don't have access to update this content"
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, {content: newContent}, {new: true});

        return res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (error) {
        
    }
}

const toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }

        const alreadyLiked = post.likes.some(
            (id)=> id.toString === userId
        );

        if(alreadyLiked){
            post.likes = post.likes.filter(
                (id)=> id.toString !== userId
            );
        }
        else{
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            message: alreadyLiked?"Post unliked":"Post liked",
            likesCount: post.likes.length,
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

module.exports = {createPosts, getPosts, myPosts, deletePost, updatePost};