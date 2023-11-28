const express = require("express");
const router = express.Router();
const { isAuthorized, isAdmin } = require("../middleware/is-auth");
const postController = require("../controllers/postController");
router.post("/createpost", isAuthorized, isAdmin, postController.createPost);
router.get("/getposts", postController.getPosts);
router.get("/getpost/:postId", postController.getPost);
router.get(
  "/deletepost/:postId",
  isAuthorized,
  isAdmin,
  postController.deletePost
);
router.post("/comment/:postId", isAuthorized, postController.addComment);
router.put(
  "/updatepost/:postId",
  isAuthorized,
  isAdmin,
  postController.updatePost
);
module.exports = router;
