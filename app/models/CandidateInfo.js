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
    paid:Number,
    newsfeed:[{heading:String,
               description:String,
               feedvideo:String,
               feedimages:[{url:String}],
               time:Date
             }],
    inbox:[{
                name:String,
                phoneno:String,
                emailid:String,
                letter:String,
                time:Date
    }]

    });

//Model
var CandidateInfoModel = mongoose.model( 'CandidateInfoSchema', CandidateInfoSchema );

module.exports = CandidateInfoModel;
