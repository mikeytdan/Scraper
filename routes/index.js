var express = require('express');
var router = express.Router();
var cheerio = require("cheerio");
var db = require("../models");
var request = require("request");
var mongoose = require("mongoose");

router.get('/', function (req, res, next) {
  request("https://www.sciencenews.org", function (error, response, html) {
    var $ = cheerio.load(html);
    var articles = [];
    $(".field-item-node-ref").each(function (i, element) {
      var headline = $(element).find("article .node-title a").text();
      var summary = $(element).find("article .content").text();
      var url = $(element).find("article .node-title a").attr("href");
      if (headline && summary && url) {
        url = "https://www.sciencenews.org" + url;
        summary = summary.replace(/(\r\n\t|\n|\r\t)/gm, "").trim();
        articles.push({ headline: headline, summary: summary, url: url, showSave: true });
      }
    });

    res.render('index', { title: "Latest News", articles: articles });
  });
});

router.get('/saved', function (req, res, next) {

  db.Article.find({})
    .populate("comments")
    .then(function (articles) {
      // If all Users are successfully found, send them back to the client
      console.log(JSON.stringify(articles, 0, 2));
      res.render('index', { title: "Saved News", articles: articles, showSave: false });
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

router.post("/save", function (req, res) {
  // Create a new Book in the database
  db.Article.create(req.body)
    .then(function (dbArticle) {
      // If the Library was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

router.post("/deleteArticle", function (req, res) {
  db.Article.findByIdAndRemove(req.body.id, function (err, article) {
    if (err) {
      res.json(err);
    } else {
      res.json(article);
    }
  });
});

router.post("/addComment", function (req, res) {
  var articleID = req.body.id;
  if (!articleID) {
    return res.status(400).json({ error: "Need article id" });;
  }

  var text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: "Need text" });;
  }

  db.Comment.create({ text: text })
    .then(function (comment) {
      return db.Article.findByIdAndUpdate(articleID, { $push: { comments: comment._id } }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.post("/deleteComment", function (req, res) {
  var articleID = req.body.articleID;
  if (!articleID) {
    return res.status(400).json({ error: "Need articleID" });;
  }

  var commentID = req.body.commentID;
  if (!commentID) {
    return res.status(400).json({ error: "Need commentID" });;
  }

  db.Comment.findByIdAndRemove(commentID, function (err, comment) {
    if (err) {
      res.json(err);
    } else {
      return db.Article.findByIdAndUpdate(articleID, { $pull: { comments: commentID } }, { new: true });
    }
  })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

module.exports = router;
