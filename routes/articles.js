//jshint esversion:6

const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// bring in mongoose models
const Article = require('../models/article');
const User = require('../models/user');
// const { findById, findOneAndDelete, deleteOne, updateOne } = require('../models/article');

// Add article page
router.get('/compose', ensureAuthenticated, (req, res) => {
  const errors = [];
  res.render('compose', { errors: errors });
});

// Add article process
router.post(
  '/compose',
  [
    check('title', 'The title field is required').notEmpty(),
    check('content', 'the post field is required').notEmpty(),
  ],
  (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    let errors = validationResult(req).array();

    console.log(errors);

    if (errors.length > 0) {
      res.render('compose', { errors: errors });
    } else {
      const newArticle = new Article({
        title: title,
        content: content,
        author: req.user._id
      });

      newArticle.save((err) => {
        if (!err) {
          req.flash('success', 'Article successfully added');
          res.redirect('/');
        }
      });
    }
  }
);

// Article page
router.get('/:postId', (req, res) => {
  Article.findById(req.params.postId, (err, article) => {
    res.render('article', { article: article, user: req.user });
  });
});

// Edit article page
router.get("/edit/:postId", ensureAuthenticated, (req, res) => {
  const errors = [];
  Article.findById(req.params.postId, (err, article) => {
    if(err) {
      console.log(err);
    } else {
      if(article.author != req.user._id) {
        req.flash("danger", "Not Authorised");
        res.redirect("/");
      }
      res.render("edit_article", {article: article, errors: errors});
    }
  });
});

// Edit article process
router.post("/edit/:postId", (req, res) => {
  const article = ({
    title: req.body.title,
    content: req.body.content
  });
  const query = {_id: req.params.postId};
  
  Article.updateOne(query, article, err => {
    if(err) {
      console.log(err);     
    } else {
      req.flash("success", "You have successfully updated the article");
      res.redirect("/");
    }
  })
})

// Delete article
router.delete("/:postId", (req, res) => {
  if(!req.user._id) {
    res.status(500).send();
  } else {
    const query = {_id: req.params.postId};
    console.log(query);
    
    Article.deleteOne(query, (err) => {
      if(err) {
        console.log(err);
      } else {
        res.send("Success");
      }
    });
  }
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login to do that");
    res.redirect("/users/login");
  }
}

module.exports = router;
