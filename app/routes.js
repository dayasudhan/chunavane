
var VendorInfoModel = require('../app/models/CandidateInfo');
var CountersModel = require('../app/models/counters');
var AWS = require('aws-sdk');
// var Firebase = require("firebase");
// var firebase = require("firebase");
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');
var Client = require('node-rest-client').Client;
var client = new Client();
var admin = require("firebase-admin");
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

// Firebase.initializeApp({
//   serviceAccount: {
//   "type": "service_account",
//   "project_id": "election-b8219",
//   "private_key_id": "82abba7994a0894b4b38ee0c66d05cf80dd99efc",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCGKNGc8VwvoTrX\njusnjmbMAmjTjBJ/2Tu/gzktQxfoY0mIe31NUufw0mnBQYOJakU1FORvw8USn3QM\nNCu8h1UvfhvkUVI/FjAdEcuBh+PFOULqFWYlalK3560qvGlE6xHnftgLQC/LI9R4\nmO0moRLBrQ2Oq2JVUwIE58xiXgw5WyMxnZ4IS1kons5UmutUw3QtRMfvwLHrkV/z\na8oP6XPXeECp7FWrvtF53PYFLRurL1bFQsSNwHFw8su8BhEhjpXXD1SDKyEpnz4E\nr8P2wTS1116mrVkNXWyY0rV7fyBvqeh/oH0AZVOzDCueFkT3Q2eZJcGUnGp9uTCb\nExXNIws/AgMBAAECggEAST2LgYR6cT4x43AQjJ2/HOzL0YGMr+MmLR00X7NbH/Dk\nOfBAra/vE5erSGe9qY0sjxgCxck4kzwdnHP21IuFQ9Iy4+hJYEt6pMQMN4C6Jfdm\nwmhARXjQA7ok3UnSpl82fQzQYQP/k4TR/6xs+0O/+5+/4P1LR41zcr4g5Cq3va9l\n4W37dOgaYCUSprWXFQtD5kztcOYNeyuPGg7IYIL/xBo8mqaH49wAf1SureSJauKK\ndEc8hq4FuR9VAWlISV4GBZ4w6DL+N2KrOFbwBiqbt6IASoh7p6k2H+beExmKCpeG\nUDORBsuMRNsYFvQDmS8q6XwYjX4TVh/Agp7jv+DaEQKBgQDorbsL+f+/GZQQ1+ds\nSMQdhvOLXpO8Oh7eAjTTY3K/UNTKCkEoTkam51Bv4O4b/qIXKbcqRyTfqbW9e/mb\nuY0SK/+2N0XTo3X71jJDRKE+Zls1j2/slaDeiUzRxXIF+J0SIgEV5hPbEGNYdGuK\niDP0Mr82GQ998kyKcMBIqG8yZQKBgQCTmzKhmt7GmwCWnxZlvc1yB1nII2r+L1CT\nVQudMgNyWLAF3XtVXC6mntGhEdzcygvB/AOwusMI60duCgZK/+x0JNdyLKvFkmeT\nh4djfppGSjwtzzW1geBgJQnyWdoBv/q6Z68Ms3NSexTODbfC2qfBpR27oECZr4Hz\n7P45S+Fa0wKBgDfBKYj9JuNL5ccDdVjlNtk8dS94Qj5gTvUz4iSlN+HQJK0lN+fI\nmfV0iDnG1EexBHY4cMOYuKU/rWTySCWgmMU59dRb+kd0a9kkwnaMA3dIX6K99Dvk\nvt+UVuwNO/1iTYEC1O/Cag+cJbIUc5CGgqyJXHhCGQw8+0pRKkI+2iZhAoGAD5Qw\nyteyrZmMfVk7Hu/icCeQdUwvrbZGtdYjDKtLq9TqdyQCMWcyUUmv7GUbP35fsVCs\n/wknLpjOiDGsqlvKlBOTXayTUJ38KpkCVCD3nXWWVmtpSsfza5JdM2QCW27swqHQ\n2vFRuaHd90WBYKJ9VDXeJoBqcQ4SFDGuP1Pf7BsCgYEA0bVl9WMaIAe8V6AtwYjz\nLx1KRQ3mZWwXdEBitciQhnDeutMgaExkwCJHag6VGfOljNe/JtgCEzqWWh0rvFzi\nUn2WZA/kcqByHIQzVqJwhFkVjRzS5/qVrTvZw0xu2HVQD4iV6OHRMS3TeIUbGqOK\ngFYR4uhQAX6sXvXp4uU16bs=\n-----END PRIVATE KEY-----\n",
//   "client_email": "khaanavali@project-8598805513533999178.iam.gserviceaccount.com",
//   "client_id": "110281937967415310229",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://accounts.google.com/o/oauth2/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/khaanavali%40project-8598805513533999178.iam.gserviceaccount.com"
// },
//   databaseURL: "https://project-8598805513533999178.firebaseio.com"
// });
// var config = {
//     apiKey: "AIzaSyDPveny7Zzop7u4eW4zZefIyxwYJCgH8ro",
//     authDomain: "election-b8219.firebaseapp.com",
//     databaseURL: "https://election-b8219.firebaseio.com",
//     projectId: "election-b8219",
//     storageBucket: "election-b8219.appspot.com",
//     messagingSenderId: "484070807157"
//   };
//   var config = {
//   apiKey: "AIzaSyDPveny7Zzop7u4eW4zZefIyxwYJCgH8ro",
//   authDomain: "election-b8219.firebaseapp.com",
//   databaseURL: "https://election-b8219.firebaseio.com",
//   storageBucket: "election-b8219.appspot.com",
//   projectId: "election-b8219"
// };
// var config2 = {
//     apiKey: "AIzaSyDPveny7Zzop7u4eW4zZefIyxwYJCgH8ro",
//     authDomain: "election-b8219.firebaseapp.com",
//     databaseURL: "https://election-b8219.firebaseio.com",
//     projectId: "election-b8219",
//     storageBucket: "election-b8219.appspot.com",
//     messagingSenderId: "484070807157"
//   };
//firebase.initializeApp(config);
var serviceAccount = require('../election-b8219-firebase-adminsdk-0t0lc-485d2e37ad.json');
//admin.initializeApp(config2);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://election-b8219.firebaseio.com"
})
//     "project_number":"484070807157",
//     "firebase_url":"https://election-b8219.firebaseio.com",
//     "project_id":"election-b8219",
//     "storage_bucket":"election-b8219.appspot.com"



//var rootRef = firebase.database().ref();
//var messagingref = firebase.messaging().ref();


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

// app.post( '/v1/comment/info/:id', function( req, res ) {
//     console.log("commentInfo post");
//     console.log(req.body);
//     console.log(req.params.id);
//     var receivedData =  JSON.parse(req.body.data);
//      return VendorInfoModel.update({ 'username':req.params.id},
//      { $addToSet: {newsfeed: {$each:[{heading: req.body.heading,description: req.body.description,feedimages: req.body.imageurl}] }}},
//        function( err, order ) {
//        if( !err ) {
//            console.log("no error");
//            console.log(order);
//            return res.send('Success');
//        } else {
//            console.log( err );
//            return res.send('ERROR');
//        }
//    });
   
// });

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
    var receivedData =  JSON.parse(req.body.data);
     return VendorInfoModel.update({ 'username':req.params.id},
     { $addToSet: {newsfeed: {$each:[{
      heading: receivedData.heading,
      description: receivedData.description,
      feedimages: url2}] }}},
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


// app.get( '/v1/feed/info/:id/:index', function( request, response ) {
//     console.log("GET --/v1/vendor/info/");

//     return VendorInfoModel.find({ 'username':request.params.id},
//       function( err, vendor ) {
//         if( !err ) {
//             console.log(vendor);
//             var new_menu_array = [];
//             var return_obj = {};
         
//               var menu_array ;
//               menu_array = vendor[0].newsfeed;
              
//               for (var i = menu_array.length - 1 ; i >= 0; i--) {

//                       new_menu_array.push(menu_array[i]);
//               }
             
       
//             return_obj["feeds"] = new_menu_array;
//             return_obj["length"] =menu_array.length;
//             return response.send( return_obj );
//         } else {
//             console.log( err );
//             return response.send('ERROR');
//         }
//     });
// });

app.get( '/v1/feed/images/:id', function( request, response ) {
    console.log("GET --/v1/vendor/info/");

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
                      for (var k = feed_images.length - 1 ; k >= 0; k--) {
                            new_feed_images_array.push(feed_images[k]);
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
// app.post( '/v1/pn/vendor/addTofirebase', function( request, response ) {
//     console.log("post v1/pn/vendor/addTofirebase");
//     console.log(request.body);
 
//     if( request.body.message ) {
//             console.log('success');
//             var pn = {};
//             pn[request.body.key]  = {
//                 info:request.body.message
//             };
//             console.log(pn); // should print  Object { name="John"}
//               rootRef.update(
//                pn
//              );

//             return response.send('success');
//         }
//         else if(request.body.update)
//           {
//             console.log('success');
//             var pn = {};
//             pn[request.body.key]  = {
//                 update2:request.body.update
//             };
//             console.log(pn); // should print  Object { name="John"}
//               rootRef.update(
//                pn
//              );
//            // rootRef.child(request.body.key).set({ first: 'Fred', last: 'Flintstone' });
//             // var newdata = {'newoffer':request.body.message};
//             //  rootRef.push(newdata);
           
//             return response.send('success');
//         }
//          else {
//             console.log( 'failure' );
//             return response.send('failure');
//         }

// });
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
// app.post( '/v1/pn/customer/addTofirebase', function( request, response ) {
//     console.log("post v1/pn/customer/addTofirebase");
//     console.log(request.body);
 
//     if( request.body.message ) {
//             console.log('success');
//             var pn = {};
//             pn['customer']  = {
//                 info:request.body.message
//             };
//             console.log(pn); // should print  Object { name="John"}
//               rootRef.update(
//                pn
//              );

//             return response.send('success');
//         }
//         else if(request.body.update)
//           {
//             console.log('success');
//             var pn = {};
//             pn['customer']  = {
//                 update:request.body.update
//             };
//             console.log(pn); // should print  Object { name="John"}
//               rootRef.update(
//                pn
//              );
//            // rootRef.child(request.body.key).set({ first: 'Fred', last: 'Flintstone' });
//             // var newdata = {'newoffer':request.body.message};
//             //  rootRef.push(newdata);
           
//             return response.send('success');
//         }
//          else {
//             console.log( 'failure' );
//             return response.send('failure');
//         }

// });
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