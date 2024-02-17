const express = require("express");
const engine = require("express-handlebars").engine;
const JsonDB = require("node-json-db").JsonDB;
const Config = require("node-json-db").Config;
const marked = require("marked");

const db = new JsonDB(new Config("database", true, false, "/"));

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (_, res) => {
  res.render("home");
});
app.get("/blogs", (_, res) => {
  res.render("blogs");
});
app.get("/blogs/:blogId", async (req, res) => {
  const id = req.params.blogId;
  const data = await db.getData(`/${id}`);
  res.render("blogPost", {
    title: data.title,
    imageUrl: data.imageUrl,
    content: marked.parse(data.content),
  });
});
app.post("/api/:blogId", async (req, res) => {
  const id = req.params.blogId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const content = req.body.content;
  await db.push(
    `/${id}`,
    {
      title: title,
      imageUrl: imageUrl,
      content: content,
    },
    false,
  );

  res.send("boom");
});

app.listen(3000);
