var mongoose = require('mongoose');
//Schema
var CandidateInfoSchema = new mongoose.Schema({
	name:String,
    username:String,
    party:String,
    constituency:String,
    email: String,
    logo:String,
    id:String,
    phone:Number, 
    address:String,
    newsfeed:[{heading:String,
               description:String,
               feedvideo:String,
               feedimages:[{url:String}]
             }]

    });

//Model
var CandidateInfoModel = mongoose.model( 'CandidateInfoSchema', CandidateInfoSchema );

module.exports = CandidateInfoModel;
