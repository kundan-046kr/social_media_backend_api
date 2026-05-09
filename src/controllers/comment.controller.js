const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

const createComment = async (req, res) => {
    try {
        const {content} = req.body;
        const postId = req.params.postId;
        const userId = req.user.id;

        if(!content || content.trim().length === 0){
            return res.status(400).json({
                error: "Comment is required"
            });
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }

        const newComment = await Comment.create({
            content,
            post: postId,
            user: userId
        });

        await newComment.populate('user', 'name email');

        return res.status(201).json({
            message: "Commented successfully",
            newComment,
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

const getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }
        const comments = await Comment.find({post: postId});

        return res.status(200).json({
            message: "Comments fetched successfully",
            post: await post.populate('user', 'name email'),
            comments
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

module.exports = {createComment, getComments};