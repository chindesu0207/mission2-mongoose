const http = require("http");
const { connect } = require("http2");
const mongoose = require("mongoose");
const Post = require("./models/post");
const dotenv = require("dotenv")
const headers = require("./headers");
const handleSuccess = require("./handleSuccess")
const handleError = require("./handleError");

dotenv.config({path:"./config.env"})

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.PASSWORD
)

mongoose
  .connect(DB)
  .then(() => console.log("資料庫連線成功"));

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  if (req.url == "/posts" && req.method == "GET") {
    const allPosts = await Post.find();
    handleSuccess(res, allPosts)
  } else if (req.url == "/posts" && req.method == "POST") {
    req.on("end", async () => {
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
          handleSuccess(res, newPost)
        }
      } catch (error) {
        handleError(res, error);
      }
    });
  } else if (req.url == "/posts" && req.method == "DELETE") {
    const deleteAll = await Post.deleteMany({});
    handleSuccess(res,[])
  } else if (req.url.startsWith("/posts/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();
    const isExist = await Post.findById(id);
    if (isExist) {
      const deletePost = await Post.findByIdAndDelete(id);
      let message = id + " has been deleted";
      handleSuccess(res, message)
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith("/posts/") && req.method == "PATCH") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const id = req.url.split("/").pop();
        const isExist = await Post.findById(id);
        if (data !== undefined && isExist) {
          const updatePost = await Post.findByIdAndUpdate(id, {
            content: data.content,
            name: data.name,
            tags: data.tags,
            likes: data.likes,
            comment: data.comment,
          });
          const updated = await Post.findById(id)
          handleSuccess(res, updated)
        } else {
          errorHandle(res);
        }
      } catch {
        errorHandle(res);
      }
    });
  } else if (req.method == "OPTION") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      status:"false",
      message:"no found"
    }))
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
