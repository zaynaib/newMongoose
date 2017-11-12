//import mongoose module
var mongoose = require('mongoose');

//set up the mongoose Schema constructor
var Schema = mongoose.Schema;

//write the schema
var articleSchema = new Schema({
	title:{
		type:String,
		required:true
	},
	body:{
		type:String
	},
	link:{
		type:String,
		required:true
	},
	note:{
		type: Schema.Types.ObjectId, 
		ref: 'Note' 

	}
})

//creates the actual table/collection of the mongo database document
var Article = mongoose.model('Article', articleSchema);

//export that data
module.exports=Article;
