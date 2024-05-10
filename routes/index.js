const HttpControllers = require("../controllers/http");
const PostsControllers = require("../controllers/posts");

const routes = async (req, res) => {
  const { url, method } = req;
  console.log(method, url);

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  if (url == "/posts" && method == "GET") {
    PostsControllers.getPosts(req, res);
  } else if (url == "/posts" && method == "POST") {
    req.on("end", () => PostsControllers.createPosts({ req, res, body }));
  } else if (url == "/posts" && method == "DELETE") {
    PostsControllers.deleteAll(req, res);
  } else if (url.startsWith("/posts/") && method == "DELETE") {
    PostsControllers.deleteOne(req, res);
  } else if (url.startsWith("/posts/") && method == "PATCH") {
    req.on("end", () => PostsControllers.updatePost({ req, res, body }));
  } else if (req.method == "OPTION") {
    HttpControllers.cors(req, res);
  } else {
    HttpControllers.notFound(req, res);
  }
};

module.exports = routes;
