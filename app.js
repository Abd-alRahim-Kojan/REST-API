const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

//DeprecationWarning solved
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
}

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

//-------------------------------

//Mongoose Schema
const articlsSchema = {
    title: String,
    content: String
  };

//Mongoose Model(collection)
const Article = mongoose.model("Article", articlsSchema);


// route Methode from express

//Targitting all Articlec
app.route("/articles")

.get(function(req,res){
    Article.find(function(err, foundArticles){
       if (!err) {
           res.send(foundArticles);
       } else {
           res.send(err);
       }
    });
   })

   .post(function(req, res){
    console.log();
    console.log();
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if (!err) {
            res.send("Successfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});


//Targitting a spaecific Articlec
app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found");
        }
    });
   })

.put(function(req, res){
    Article.updateOne(
        { title: req.params.articleTitle },
        { $set:  {title: req.body.title, content: req.body.content} },
        (error, result) => {
        if (!error) {
            res.send("Successfully Updated article");
        } else {
            res.send("No changes");
        }
      });
})

.patch(function(req, res){
    Article.updateOne(
        { title: req.params.articleTitle },
        { $set:  req.body},
        (error, result) => {
        if (!error) {
            res.send("Successfully Updated article");
        }
      });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });