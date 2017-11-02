var mongoose = require('mongoose');
//Schema
var CoverageAreaSchema = new mongoose.Schema({
    cityName:String,
    id:String,
    subAreas:[{name:String, isBulkAreaOnly:Number}],
    sliders:{logo1:String,logo2:String,logo3:String,logo4:String}
    });

//Model
var CoverageAreaModel = mongoose.model( 'CoverageAreaSchema', CoverageAreaSchema );

module.exports = CoverageAreaModel;