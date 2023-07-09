const express = require("express");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { json } = require("sequelize");
const router = express.Router();

//회원가입 api
router.post("/users", async (req, res) => {
  const { email, password, nickname } = req.body;
  const isExistEmail = await Users.findOne({
    where: {
      email: email,
    },
  });
  // 동일한 이메일이 있을시 에러메세지 발생
  if (isExistEmail) {
    return res.status(400).json({ message: "존재하는 이메일입니다" });
  }

  const isExistNickname = await Users.findOne({
    where: {
      nickname: nickname,
    },
  });
  // 동일한 닉네임이 있을시 에러메세지 발생
  if (isExistNickname) {
    return res.status(400).json({ message: "존재하는 닉네임입니다" });
  }
  // 사용자 테이블에 데이터 삽입
  await Users.create({
    email,
    nickname,
    password,
  });
  return res.status(201).json({ message: "회원가입이 완료되었습니다" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({
    where: { email },
  });
  if (!user) {
    return res
      .status(401)
      .json({ message: "해당하는 사용자가 존재하지 않습니다" });
  } else if (user.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다" });
  }

  //jwt 생성
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "customizde_secret_key"
  );
  //쿠키 발급
  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인에 성공했습니다" });
});

//사용자 조회 api
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  //사용자 테이블에 있는 데이터를 가지고 옴
  const user = await Users.findOne({
    where: { userId },
  });
  return res.status(200).json({ data: user });
});

module.exports = router;
