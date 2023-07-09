const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const likeRouter = require("./routes/likes.js");
const app = express();
const PORT = process.env.PORT;

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use("/api", [usersRouter, postsRouter, likeRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
