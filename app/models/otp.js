var mongoose = require('mongoose');
//Schema
var Otp = new mongoose.Schema({
    otpnumber:Number,
    _id:String
    });

//Model
var OtpModel = mongoose.model( 'Otp', Otp );

module.exports = OtpModel;