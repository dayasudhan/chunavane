var mongoose = require('mongoose');
//Schema
var OrderSchema = new mongoose.Schema({
	hotel:{name:String,email: String,phone:Number,id:String},
    menu:[{name: String,no_of_order:Number}],
    current_status:String,
    tracker:[{status: String,time:Date,reason:String}],
    date:Date,
    customer:{       id:String, name: String,        phone: Number,        email: String,        
        address:{addressLine1:String,addressLine2:String,street:String, 
        	LandMark:String, areaName:String,city:String, zip:String, 
        	latitude:Number,longitude:Number }
    },
    bill_value:Number,
    deliveryCharge: Number,
    totalCost:Number,
    id:String,
    ordertype:Number
});

//Model
var OrderModel = mongoose.model( 'Order', OrderSchema );

module.exports = OrderModel;