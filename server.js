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
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// Set Handlebars.

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//connect to database
//if the database does not exist it will create one
//the port does not matter you can just say localhost
mongoose.connect('mongodb://localhost/news',{useMongoClient:true});
mongoose.Promise =global.Promise;

//monitor the status of the connection
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log("we're connected!")
// });



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
		})
		
	})
})


app.listen(port, function(){ 
	console.log("App running on port " +port+"!")
});





