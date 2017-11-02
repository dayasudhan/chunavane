var mongoose = require('mongoose');
//Schema
var ProfileInfoSchema = new mongoose.Schema({
	id:String,
	phone:Number,
	name:String,
	email: String,
	dob:Date,
	gender:String,
	cast:String,
	occupation:String,
	education:String,
	logo:[{url:String}],
	origin:String,
	summary:String,
	interests:[{name:String}],
	father:{name:String,occupation:String,phone:String},
	mother:{name:String,occupation:String,phone:String},
	addresses:{label:String, 
		addressLine1:String,
		addressLine2:String,
		street:String, 
		LandMark:String, 
		areaName:String,
		city:String, 
		zip:String, 
		latitude:Number,
		longitude:Number }
    });

//Model
var ProfileInfoModel = mongoose.model( 'ProfileInfoSchema', ProfileInfoSchema );

module.exports = ProfileInfoModel;