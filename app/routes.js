
var VendorInfoModel = require('../app/models/CandidateInfo');
var CountersModel = require('../app/models/counters');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');
var Client = require('node-rest-client').Client;
var client = new Client();
var admin = require("firebase-admin");
var admin2 = require("firebase-admin");
var admin3 = require("firebase-admin");
//AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();

//var upload = multer({ storage: options });
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'chunavane',
        acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, req.params.id + '/' + 'main' + Date.now() + path.extname(file.originalname)); //use Date.now() for unique file keys
        }
    })
});


// var serviceAccount = require('../election-b8219-firebase-adminsdk-0t0lc-485d2e37ad.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://election-b8219.firebaseio.com"
// })

var serviceAccount2 = require('../kumarannajds-firebase-adminsdk-nzaxn-2da5c6c6e9.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount2),
  databaseURL: "https://kumarannajds.firebaseio.com"
})

// var serviceAccount3 = require('../sharadhapnaikjdsshimoga-firebase-adminsdk-2ymgd-fdb55e27c3.json');
// admin3.initializeApp({
//   credential: admin3.credential.cert(serviceAccount3),
//   databaseURL: "https://sharadhapnaikjdsshimoga.firebaseio.com"
// })

module.exports = function(app, passport) {



// normal routes ===============================================================

// show the home page (will also have our login links)
app.get('/test', function(req, res) {
    res.send('index.ejs');
});


// LOGOUT ==============================
app.get('/logout', function(req, res) {
  console.log('/logout');
  var redirect_url = '/';
    req.logout();
    res.redirect(redirect_url);
});

app.get('/vendor_logout', function(req, res) {
    var redirect_url = '/vendor';
    req.logout();
    res.redirect(redirect_url);
});

app.get('/login', function(req, res) {
    res.render('customer_login.ejs', { message: req.flash('loginMessage') });
});

app.post('/login', function(req, res, next) {
    console.log('post /login');
      console.log(req.body);
  passport.authenticate('local-login', function(err, user, info) {
   
    if (err) {
         console.log("error in login 0");
        return next(err); }
    if (!user) {
         var redirect_url = '/';
            if(req.body.role == 'customer')
            {
                //redirect_url = '/signup';
                console.log("error in login 1");
                 return res.send("0"); 

            } 
            
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log(req.body.role);
      var redirect_url = '/';
      if(req.body.role == 'customer')
      {
        //redirect_url = '/';
        redirect_url = '/p/candidate_update';
        return res.redirect(redirect_url);
       }
     
    });
  })(req, res, next);
});

app.post('/v1/m/login', function(req, res, next) {
    console.log('post /v1/m/login');
     console.log(req.body);
  passport.authenticate('local-login', function(err, user, info) {
   
    if (err) {console.log('post /v1/m/login  1');return next(err); }
    if (!user) {
        console.log('post /v1/m/login  2');
        return res.send("0"); 
    }
    req.logIn(user, function(err) {
        console.log('post /v1/m/login  3');
      if (err) {
      console.log('post /v1/m/login 4'); 
      

        return next(err); }
       console.log("store the uniqui id") 
              storeVendoruniqueId(req,res,function(req,res){
           console.log("storeVendoruniqueId success");
           
        });
      return res.send("1");
    });
    console.log('post /v1/m/login 5');
  })(req, res, next);
});


// SIGNUP =================================
// show the signup form
app.get('/signup', function(req, res) {
    res.render('customer_signup.ejs', { message: req.flash('signupMessage') });
});

    

app.get('/vendor', function (req, res) {
    res.render('vendor_login', { user : req.user });
});
app.get('/', function (req, res) {
     res.render('customer_login.ejs', { message: req.flash('loginMessage') });
});



app.get('/p/vendor_details', function (req, res) {
    res.render('vendor_details', { user : req.user });
});
app.get('/p/candidate_update', function (req, res) {
    res.render('candidate_update', { user : req.user });
});

app.get('/p/vendor_login', function (req, res) {
    res.render('vendor_login', { user : req.user });
});

app.get('/p/vendor_signup', function(req, res) {
    res.render('vendor_signup', { });
});

app.get('/about_us', function (req, res) {
    res.render('about_us', { user : req.user });
});

app.get('/admin', function (req, res) {
    res.render('admin_login', { user : req.user });
});

app.get('/p/admin_order', function (req, res) {
    console.log(req.user);
    res.render('admin_order', { user : req.user });
});
app.get('/p/admin_order_today', function (req, res) {
    console.log(req.user);
    res.render('admin_order_today', { user : req.user });
});



app.post('/reset', function(req, res, next) {
console.log(req.body);
  if(req.body.password != req.body.password2)
  {
     
  console.log("password mimatchmatch");
     return res.send('ERROR');
  }
  else
  {
    console.log("password match");
  }
  console.log('/reset');
    passport.authenticate('local-reset', function(err, user, info) {
     console.log(req.body);
      if (err) { 
        return next(err); }
      if (!user) { 
          return res.send("0");
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        console.log(req.body.role);
        var redirect_url;
        if(req.body.role == 'customer')
        {
       
         return CustomerInfoModel.find({ 'phone':req.body.email},function( err, customerInfo ) {
            if( !err ) {
                return res.send( customerInfo );
            } else {
                console.log( err );
                return res.send('ERROR');
            }
        });
 
        return res.send("1");
        }
       
      });
    })(req, res, next);
});


app.post('/signup', function(req, res, next) {
console.log(req.body);
  if(req.body.password != req.body.password2)
  {
     
  console.log("password mimatchmatch");
     return res.send('ERROR');
  }
  else
  {
    console.log("password match");
  }
    console.log('/signup');
    passport.authenticate('local-signup', function(err, user, info) {
     console.log(req.body);
      if (err) { 
        return next(err); }
      if (!user) { 
          var redirect_url = '/signup';
          return res.redirect(redirect_url); 
       }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        console.log(req.body.role);
        var redirect_url = '/p/vendor_details';
        registerVendor(req, res, next);
        return res.redirect(redirect_url);
      });
    })(req, res, next);
});

function registerVendor(req, res, next) {
  console.log("/registerVendor");
  var hotel_id = "C";
  var res = getNextSequence('candidate',function(data) {

    hotel_id = hotel_id + data.sequence;
    console.log(hotel_id);

      var vendorInfo = new VendorInfoModel({
        username:req.body.email,
        id:hotel_id
      });
      vendorInfo.save( function( err ) {
        if( !err ) {
              console.log( 'registerVendor created' );
              console.log(req.body.email);
                  req.session.save(function (err) {
                    if (err) {
                        console.log( 'registerVendor save error' );
                      return next(err);
                    }
                    console.log( 'registerVendor save complete' );
                  });
              return ;
              } else {
                console.log( 'registerVendor error' );
                console.log( err );
                return response.send('ERROR');
              }
        });
    });
};


app.post( '/v1/comment/info/:id',upload.array('file',5), function( req, res ) {
    console.log("commentInfo post");
    console.log(req.body);
    console.log(req.params.id);
    console.log('files->',req.files);
    console.log('file->',req.file);
    
    console.log('Successfully uploaded ' + req.files.length + ' files!');
    var url2 = [];
    for (var i = 0; i < req.files.length; i++) {
    
      console.log(req.files[i].location);
      var elem = {url:req.files[i].location};
     // var elem[url]  =  req.files[i].location;
      url2.push( elem);
    }
    console.log(url2);
    var youtubeid = "";
    var receivedData =  JSON.parse(req.body.data);

    if(receivedData.feedvideo != null && receivedData.feedvideo.length > 0 )
    {
       var nu = receivedData.feedvideo.indexOf("=");
       youtubeid = receivedData.feedvideo.substring(nu+1);
    }
    console.log(youtubeid);

    var indiantime = new Date();

    indiantime.setHours(indiantime.getHours() + 5);
    indiantime.setMinutes(indiantime.getMinutes() + 30);

    return VendorInfoModel.update({ 'username':req.params.id},
     { $addToSet: {newsfeed: {$each:[{
      heading: receivedData.heading,
      description: receivedData.description,
      feedvideo:youtubeid,
      time:indiantime,
      feedimages: url2}], }}},
       function( err, order ) {
       if( !err ) {


              var topic = "news";
              var payload = {
                 notification: {
                  title: receivedData.heading,
                  icon: "your_icon_name",
                  body: receivedData.description,
              }
                };  
                // if(req.params.id == "hdk")
                // {
                //     admin = admin2;
                // }
                // else if(req.params.id == "spnjds")
                // {
                //     admin = admin3;
                // }
            admin.messaging().sendToTopic(topic, payload)
            .then(function(response2) {
              // See the MessagingTopicResponse reference documentation for the
              // contents of response.
              console.log("Successfully sent message:", response2);
             // response.send(response2);
            })
            .catch(function(error) {
              console.log("Error sending message:", error);
            });

           console.log("no error");
           console.log(order);
           return res.send('Success');
       } else {
           console.log( err );
           return res.send('ERROR');
       }
   });
   
});

app.get( '/v1/feed/manifesto/:id', function( request, response ) {
    console.log("GET --/v1/feed/manifesto/");
    var prefix = request.params.id + '_manifesto/';
    console.log(prefix);
            var params = { 
              Bucket: 'chunavane',
              Delimiter: '',
              Prefix: prefix 
            }

        s3.listObjects(params, function (err, data) {
          if(err)throw err;
           var new_menu_array = [];
             var menu_array ;
            // console.log(data);
              menu_array = data.Contents;
             // console.log(menu_array);
          for (var i = 1 ; i < menu_array.length ; i++) {

            var url = "https://s3.ap-south-1.amazonaws.com/chunavane/";
            url = url + menu_array[i].Key;
            var url2= {};
            url2['url'] =url ;
             console.log(menu_array[i].Key);
                      new_menu_array.push(url2);

              }
          response.send(new_menu_array);
        });

});
app.get( '/v1/feed/info/:id', function( request, response ) {
    console.log("GET --/v1/vendor/info/");

    return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendor ) {
        if( !err ) {
            console.log(vendor);
            var new_menu_array = [];
            for (var j = 0; j < vendor.length; j++) {
              var menu_array ;
              menu_array = vendor[j].newsfeed;
              
              for (var i = menu_array.length - 1 ; i >= 0; i--) {

                      new_menu_array.push(menu_array[i]);

              }
             
            }
            return response.send( new_menu_array );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

app.get( '/v1/feed/images/:id', function( request, response ) {
    console.log("GET --/v1/feed/images/");

    return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendor ) {
        if( !err ) {
            console.log(vendor);
            var new_menu_array = [];
            var new_feed_images_array = [];
            for (var j = 0; j < vendor.length; j++) {
              var menu_array ;
              menu_array = vendor[j].newsfeed;
              
              for (var i = menu_array.length - 1 ; i >= 0; i--) {

                      new_menu_array.push(menu_array[i]);
                      var feed_images = menu_array[i].feedimages;
                      if(feed_images != null)
                      {
                      for (var k = feed_images.length - 1 ; k >= 0; k--) {
                            new_feed_images_array.push(feed_images[k]);
                        }
                      }
                     }
             
            }
            return response.send( new_feed_images_array );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

app.get( '/v1/feed/videos/:id', function( request, response ) {
    console.log("GET --/v1/feed/videos/");

    return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendor ) {
        if( !err ) {
            console.log(vendor);
           
            var new_feed_images_array = [];
            for (var j = 0; j < vendor.length; j++) {
              var menu_array ;
              menu_array = vendor[j].newsfeed;
              
              for (var i = menu_array.length - 1 ; i >= 0; i--) {

                    
                      var feed_images = menu_array[i].feedvideo;
                      if (feed_images != null && feed_images != "") {
                            new_feed_images_array.push(menu_array[i]);
                        }
                     }
             
            }
            return response.send( new_feed_images_array );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
 
app.get( '/v1/admin/account/all', function( request, response ) {

    return VendorInfoModel.find(function( err, order ) {
        if( !err ) {
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});


app.post( '/v1/vendor/info/:id', function( req, res ) {
    console.log("VendorInfo post");
    console.log(req.body);
    storeCandidateInfo(req,res,function(req,res){
      console.log("storeCandidateInfo success");
    });
});

function storeCandidateInfo(request,response,callback,param)
{
console.log("storeCandidateInfo");
console.log(request.params.id);

 VendorInfoModel.update({ 'username':request.params.id},
      {
        name:request.body.name,
        party:request.body.party,
        constituency:request.body.constituency,
        email:request.body.email2, 
        phone:request.body.phone ,
        logo:request.body.logo
      },
       function( err ) {
        if( !err ) {
            console.log( 'storeCandidateInfo created' );
            callback(request,response);
            return ;
        } else {
         console.log( 'storeCandidateInfo error' );
            console.log( err );
            return response.send('ERROR');
        }
    });
}

function storeVendoruniqueId(request,response,callback,param)
{
console.log("storeVendorUniquiId");
console.log(request.params.id);
 VendorInfoModel.update({ 'hotel.email':request.body.email},
      {
        uniqueid:request.body.uniqueid
      },
       function( err ) {
        if( !err ) {
            console.log( 'storeVendorUniquiId created' );
            callback(request,response);
            return ;
        } else {
         console.log( 'storeVendorUniquiId error' );
            console.log( err );
            return response.send('ERROR');
        }
    });
}



//unregister a book
app.delete( '/v1/vendor/unregister/:id', function( request, response ) {
        return VendorInfoModel.remove( { 'hotel.email':request.params.id},function( err ) {
            if( !err ) {
                console.log( 'Book removed' );
                return response.send( '' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    //});
});

app.get('/ping', function(req, res){
    res.status(200).send("pong!");
});


app.get( '/v1/admin/account/all', function( request, response ) {

    return VendorInfoModel.find(function( err, order ) {
        if( !err ) {
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

app.get( '/v1/admin/counters/all', function( request, response ) {

    return CountersModel.find(function( err, order ) {
        if( !err ) {
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

app.post( '/v1/admin/counters/:id', function( request, response ) {
    console.log("post /v1/admin/counters");

    console.log(request.params.id);
     //var dd = {'cityName':"dvg",'subAreas':[{'name':"rajajinagar"},{'name':"vijaynagar"}]};
     var dd = {_id:request.params.id,
                sequence:0};
      var counters = new CountersModel(
         dd);
        return counters.save(function( err) {
        if( !err ) {
            console.log("no error");
            console.log(counters);
            return response.send(counters);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
function getNextSequence(name,result)
{
   
    var ret = CountersModel.findOneAndUpdate(
            { _id: name },
            { $inc: { sequence: 1 }} ,
        function( err, order ) 
        {
        if( !err ) {
            console.log("no error");
            console.log(order);
            ret2 = order;
            result(order);
           // return order;
         
        } else {
            console.log( err );
           result(err);
        }
    });

}


app.post( '/v1/pn/register', function( request, response ) {
    console.log("post v1/pn/register");
    console.log(request.body);
 
    if( 1 ) {
            console.log('success');
            
            return response.send('success');
        } else {
            console.log( 'failure' );
            return response.send('failure');
        }

});
app.get( '/v1/pn/customer/fcm/:id', function( request, response ) {
      console.log("post v1/pn/customer/addTofirebase");
     
      var topic = "news";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
      var payload = {
       notification: {
        title: "Hello World2! ",
        icon: "your_icon_name",
        body: "Here is a not2222ification's body.",
    }
      };  
      admin.messaging().sendToTopic(topic, payload)
      .then(function(response2) {
        // See the MessagingTopicResponse reference documentation for the
        // contents of response.
        console.log("Successfully sent message:", response2);
        response.send(response2);
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });
    });

app.delete( '/v1/admin/counters/:id', function( request, response ) {
        return CountersModel.remove( { '_id':request.params.id},function( err ) {
            if( !err ) {
                console.log( 'counter removed' );
                return response.send( '' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    //});
});
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    {
      console.log("isLoggedIn");
        return next();
    }
    else
    {
       console.log("not loggedin isLoggedIn");
    }

    res.redirect('/');
}