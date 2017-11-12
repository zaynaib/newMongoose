'use strict'
//require modules
var express= require('express');
//var hbs = require('');
var bodyParser = require('body-parser');
var request = require('request');
var cherrio = require('cherrio')
var mongoose = require('mongoose');


//connect to database
//if the database does not exist it will create one
//the port does not matter you can just say localhost
mongoose.connect('mongodb://localhost/news',{useMongoClient:true});
mongoose.Promise =global.Promise;

//monitor the status of the connection





