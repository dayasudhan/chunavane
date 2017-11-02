var mongoose = require('mongoose');
//Schema
var Counters = new mongoose.Schema({
    sequence:Number,
    _id:String
    });

//Model
var CountersModel = mongoose.model( 'Counters', Counters );

module.exports = CountersModel;