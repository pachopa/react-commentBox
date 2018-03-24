'use strict'
//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./model/comments');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set 
//it up, or 3001
var port = process.env.API_PORT || 3001;

//db config
mongodb://<dbuser>:<dbpassword>@ds123399.mlab.com:23399/web-comment-app

mongoose.connect('mongodb://comment-web-app:hi12345678@ds123399.mlab.com:23399/comment-web-app');

//now we should configure the API to use bodyParser and look for 
//JSON data in the request body

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now we can set the route path & initialize the API
router.get('/', function (req, res) {
  res.json({ message: 'API Initialized!' });
});

//adding the /comments route to our /api router
router.route('/comments')
  //retrieve all comments from the database
  .get(function (req, res) {
    //looks at our Comment Schema
    Comment.find(function (err, comments) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(comments)
    });
  })
  //post new comment to the database
  .post(function (req, res) {
    var comment = new Comment();
    //body parser lets us use the req.body
    comment.author = req.body.author;
    comment.text = req.body.text;
    comment.save(function (err) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment successfully added!' });
    });
  });
router.route('/comments/:comment_id')
  .put(function (req, res) {
    Comment.findById(req.params.comment_id, function (err, comment) {
      if (err) {
        res.send(err);
      }
      (req.body.author) ? comment.author = req.body.author : null;
      (req.body.text) ? comment.text = req.body.text : null;

      comment.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Comment has been updated' });
      })
    })
  })
  .delete(function (req, res) {
    Comment.remove({ _id: req.params.comment_id }, function (err, comment) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Comment has been deleted' });
    })
  })


//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function () {
  console.log(`api running on port ${port}`);
});