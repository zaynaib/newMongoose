'use strict'
//require modules
var express= require('express');
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars");
var request = require('request');
var cheerio = require('cheerio')
var mongoose = require('mongoose');


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
		$("h2.headline").each(function(i,element){

			var result = {}
			
			var title =$(element).text();
			var link = $(element).children("a").attr("href");
			//console.log("title:", title);
			//console.log("link:", link);

			if(title && link){

			}

		})
	})
	res.send("it scraped everything")
})

//scrape the title,link,body of the article
/*
setup handlebars
scrape the data using cheerio and request
then push the results in the mongo database
then put them on the webpage


*/

//then 
app.listen(port, function(){ 
	console.log("App running on port " +port+"!")
});





