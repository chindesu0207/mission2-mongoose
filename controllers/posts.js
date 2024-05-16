const Post = require("../models/post");
const handleSuccess = require("../service/handleSuccess");
const handleError = require("../service/handleError");

const posts = {
  async getPosts(req, res) {
    const allPosts = await Post.find();
    handleSuccess(res, allPosts);
    res.end();
  },
  async createPosts({ req, res, body }) {
    try {
      const data = JSON.parse(body);
      if (data.content !== undefined) {
        const newPost = await Post.create({
          content: data.content,
          name: data.name,
          tags: data.tags,
          likes: data.likes,
          comment: data.comment,
        });
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (error) {
      handleError(res, error);
    }
  },
  async deleteAll(req, res) {
    await Post.deleteMany({});
    handleSuccess(res, []);
  },
  async deleteOne(req, res) {
    try {
      const id = req.url.split("/").pop();
      const isExist = await Post.findById(id);
      if (isExist) {
        await Post.findByIdAndDelete(id);
        let message = id + " has been deleted";
        handleSuccess(res, message);
        res.end();
      } else {
        handleError(res);
      }
    } catch (error) {
      handleError(res, error);
    }
  },
  async updatePost({ req, res, body }) {
    try {
      const data = JSON.parse(body);
      const id = req.url.split("/").pop();
      const isExist = await Post.findById(id);
      if (data !== undefined && isExist) {
        const updatePost = await Post.findByIdAndUpdate(
          id,
          {
            content: data.content,
            name: data.name,
            tags: data.tags,
            likes: data.likes,
            comment: data.comment,
          },
          { new: true }
        );
        handleSuccess(res, updatePost);
      } else {
        handleError(res);
      }
    } catch {
      handleError(res);
    }
  },
};

module.exports = posts;
