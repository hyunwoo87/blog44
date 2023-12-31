const express = require("express");
const { Op } = require("sequelize");
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 게시글 생성 api
router.post("/posts", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content, nickname } = req.body;

  const post = await Posts.create({
    UserId: userId,
    title,
    content,
    nickname,
  });

  return res.status(201).json({ data: post });
});

// 게시글 목록 조희 api
router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ["postId", "title", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: posts });
});

// 게시글 상세 조회api
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    where: { postId },
  });

  return res.status(200).json({ data: post });
});

//게시글 수정 api
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  // 게시글을 조회
  const post = await Posts.findOne({ where: { postId } });

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  // 게시글의 권한을 확인하고, 게시글을 수정
  await Posts.update(
    { title, content },
    {
      where: {
        [Op.and]: [{ postId }, { UserId: userId }],
      },
    }
  );

  return res.status(200).json({ data: "게시글이 수정되었습니다." });
});

// 게시글 삭제 api
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  // 게시글을 조회
  const post = await Posts.findOne({ where: { postId } });

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  // 게시글의 권한을 확인하고, 게시글을 삭제
  await Posts.destroy({
    where: {
      [Op.and]: [{ postId }, { UserId: userId }],
    },
  });

  return res.status(200).json({ data: "게시글이 삭제되었습니다." });
});

module.exports = router;
