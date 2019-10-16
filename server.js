const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");

const axios = require("axios");
const cheerio = require("cheerio");


const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();




app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(__dirname + '/public'));


app.engine("handlebars", exphbs({ defaultLayout: "home" }));
app.set("view engine", "handlebars");
app.set('index', __dirname + '/views');


app.get("/", function (req, res) {
  db.Article.find({}, function (err, result) {
      if (err) throw err;
      res.render("index", {result})
  });

app.get("/scrape", function(req, res) {
    
    axios.get("http://www.latimes.com").then(function(response) {
  
      var $ = cheerio.load(response.data);

      $("article h2").each(function(i, element) {
      
        var result = {};
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        
        db.Article.create(result)
          .then(function(dbArticle) {
           
            console.log(dbArticle);
          })
          .catch(function(err) {
           
            console.log(err);
          });
      });
     res.send("Scrape Complete");
    
    });
  });
  
 
  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  
  app.get("/articles/:id", function(req, res) {
 
    db.Article.findOne({ _id: req.params.id })
    
      .populate("note")
      .then(function(dbArticle) {

        res.json(dbArticle);
      })
      .catch(function(err) {
        
        res.json(err);
      });
  });
  

  app.post("/articles/:id", function(req, res) {
   
    db.Note.create(req.body)
      .then(function(dbNote) {

        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
   
        res.json(dbArticle);
      })
      .catch(function(err) {
     
        res.json(err);
      });
  });
});

app.post('/saves/:id', function(req, res) {
  db.Article.findByIdAndUpdate(req.params.id, {
      $set: { saved: true}
      },
      { new: true },
      function(error, result) {
          if (error) {
              console.log(error);
          } else {
              res.redirect('/');
          }
      });
});

app.get("/views/saves", function (req, res) {
  var savedArticles = [];
  db.Article.find({ saved: true }, function (err, saved) {
      if (err) throw err;
      savedArticles.push(saved)
      res.render("saves", { saved })
  })
});

  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

  mongoose.connect(MONGODB_URI);

  
  app.listen(PORT, function() {
    console.log("App running on port " + PORT)
  });
