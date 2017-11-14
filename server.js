'use strict'
//require modules
var express= require('express');
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars");
var request = require('request');
var cheerio = require('cheerio')
var mongoose = require('mongoose');

//Require all models
var db = require("./models");

var port = process.env.PORT || 3000;

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("views/layouts"));

app.use(bodyParser.urlencoded({ extended: true }));

// Set Handlebars.

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//connect to database
//if the database does not exist it will create one
//the port does not matter you can just say localhost
mongoose.connect('mongodb://localhost/news',{useMongoClient:true});
mongoose.Promise =global.Promise;

// Import routes and give the server access to them.
//var routes = require("./controllers/catsController.js");

//app.use("/", routes);
app.get("/",function(req,res){
	res.send("hello");
})

//create a route to scrape the nyt website

app.get("/scrape", function(req, res){
	//call request
	request("https://www.nytimes.com/section/food", function(err,response,html){
		var $ = cheerio.load(html);
		$("div.story-meta").each(function(i,element){
			var result = {};

			result.title = $(this).children("h2.headline").text().trim();
			result.link =$(this).parent().attr("href");
			result.summary=$(this).children("p.summary").text();

			//console.log(result);
			db.Article
				.create(result)
				.then(function(dbArticle){

				res.send("it scraped everything")
				})
				.catch(function(err){
					res.json(err);
				});
		})//end of for loop
		
	})//end of request route
})//end of route

app.get("/articles", function(req,res){
	//do the query
	//create a promise once the query is done
	//send all the data into backend
	db.Article.find({})
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err){
			res.json(err);
		})
})

app.get("/articles/:id",function(req,res){
	var id = req.params.id;
	db.Article.findById(id)
		.populate("note")
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err){
			res.json(err);
		})

})

app.post("/articles/:id",function(req,res){
	var id = req.params.id;
	db.Note 
		.create(req.body)
		.then(function(dbNote){
			return db.Article.findOneAndUpdate({_id:id},{note:dbNote._id},{new:true});
		})
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err){
			res.json(err);
		});
});




app.delete("/articles/:id",function(req,res){
	var id = req.params.id;
	db.Article.findById(id)
		.then(function(dbArticle){
			var noteId = dbArticle.note;
			return db.Note.findByIdAndRemove(noteId);
		}).then(
			function(){
				res.send("success")
				console.log("success")
			})
		.catch(function(err){
			res.json(err);
		})

});


app.listen(port, function(){ 
	console.log("App running on port " +port+"!")
});





