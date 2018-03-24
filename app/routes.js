
var VendorInfoModel = require('../app/models/CandidateInfo');
var CountersModel = require('../app/models/counters');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');
var Client = require('node-rest-client').Client;
var client = new Client();
var admin = require("firebase-admin");
var firebase = require("firebase");
//AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();

//var upload = multer({ storage: options });

var securecustomerkey = 'EjR7tUPWx7WhsVs9FuVO6veFxFISIgIxhFZh6dM66rs';
var securevendorkey = 'ORql2BHQq9ku8eUX2bGHjFmurqG84x2rkDQUNq9Peelw';
var secureadminkey = 'tk0M6HKn0uzL%2FcWMnq3jkeF7Ao%2BtdWyYEJqPDl0P6Ac';
var securewebkey = 'RN4CDXkqltLF%2FWloegKujIhiaSWBrgCzQXqI9cyWpT0';
var version_value_1 = '1';
var client_key_vendor = 'tunga';
var client_key_customer = 'bhoomika';
var client_key_admin = 'gajanuru';
var client_key_web = 'pickcock';

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'chunavane',
        acl: 'public-read',
        key: function (req, file, cb) {
          var filesuffix = "image";
          console.log(file);
          if(file.mimetype.startsWith("video"))
          {
              filesuffix = "video/main";
              cb(null, req.params.id + '/' +filesuffix+ Date.now() + path.extname(file.originalname));
          }
          else if(file.mimetype.startsWith("image"))
          {
               filesuffix = "image/main";
               cb(null, req.params.id + '/' +filesuffix+ Date.now() + path.extname(file.originalname));
          }
          else if(file.mimetype.startsWith("audio"))
          {

               filesuffix = "audio/main";
               cb(null, req.params.id + '/' +filesuffix+ Date.now() + path.extname(file.originalname));
          }
          else
           {
            console.log("invalid file format") 
           } 
        }
    })
});
var uploadscroll = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'chunavane',
        acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file);
            if(file.mimetype.startsWith("image"))
            {
              cb(null, req.params.id + '/' + 'scroll'+'/'+ 'main' + Date.now() + path.extname(file.originalname)); //use Date.now() for unique file keys
            }
            else
            {
             console.log("invalid file format") 
            } 
        }
    })
});

var uploadsuggestion = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'chunavane',
        acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, req.params.id + '/' + 'suggestion'+'/'+ 'main' + Date.now() + path.extname(file.originalname)); //use Date.now() for unique file keys
        }
    })
});
var serviceAccount = require('../election-b8219-firebase-adminsdk-0t0lc-485d2e37ad.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://election-b8219.firebaseio.com"
})

// var serviceAccount2 = require('../kumarannajds-firebase-adminsdk-nzaxn-2da5c6c6e9.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount2),
//   databaseURL: "https://kumarannajds.firebaseio.com"
// })

// var serviceAccount3 = require('../sharadhapnaikjdsshimoga-firebase-adminsdk-2ymgd-fdb55e27c3.json');
// admin3.initializeApp({
//   credential: admin3.credential.cert(serviceAccount3),
//   databaseURL: "https://sharadhapnaikjdsshimoga.firebaseio.com"
// })
var config = {
  apiKey: "AIzaSyDPveny7Zzop7u4eW4zZefIyxwYJCgH8ro",
  authDomain: "election-b8219.firebaseapp.com",
  databaseURL: "https://election-b8219.firebaseio.com",
  storageBucket: "election-b8219.appspot.com",
  projectId: "election-b8219"
};
firebase.initializeApp(config);
var rootRef = firebase.database().ref();
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
    var redirect_url = '/';
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
app.get('/p/vendor_reset', function(req, res) {
    res.render('vendor_reset', { });
});
app.get('/about_us', function (req, res) {
    res.render('about_us', { user : req.user });
});

app.get('/admin', function (req, res) {
    res.render('admin_login', { user : req.user });
});

app.get('/p/inbox', function (req, res) {
    console.log(req.user);
    res.render('inbox', { user : req.user });
});
app.get('/p/myposts', function (req, res) {
    console.log(req.user);
    res.render('myposts', { user : req.user });
});
app.get('/p/scrollimages', function (req, res) {
    console.log(req.user);
    res.render('scrollimages', { user : req.user });
});
app.post('/p/vendor_reset', function(req, res, next) {
console.log(req.body);
  if(req.body.password != req.body.password2)
  {
     
  console.log("password mimatchmatch");
     return res.send('ERROR');
  }
  else if(req.body.adminpassword != "hirebasuru")
  {
      console.log("adminpassword mimatchmatch");
     return res.send('ERROR');
  }
  else
  {
    console.log("password match");
  }
  console.log('/vendor_reset');
    passport.authenticate('local-reset', function(err, user, info) {
     console.log(req.body);
      if (err) { 
        return next(err); }
      if (!user) { 
          return res.send("0");
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
     //   console.log(req.body.role);
   //     var redirect_url;
        // if(req.body.role == 'customer')
        // {
       
        //  return CustomerInfoModel.find({ 'phone':req.body.email},function( err, customerInfo ) {
        //     if( !err ) {
        //         return res.send( customerInfo );
        //     } else {
        //         console.log( err );
        //         return res.send('ERROR');
        //     }
        // });
 
        return res.send("1");
        
       
      });
    })(req, res, next);
});


app.post('/p/vendor_signup', function(req, res, next) {
console.log(req.body);
  if(req.body.password != req.body.password2)
  {
     
  console.log("password mimatchmatch");
     return res.send('ERROR');
  }
  else if(req.body.adminpassword != "hirebasuru")
  {
      console.log("adminpassword mimatchmatch");
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
          var redirect_url = '/p/vendor_signup';
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
app.post( '/v1/candidate/suggestion/:id', function( req, res ) {
    console.log("post /v1/candidate/suggestion/");
  if(checkVendorApiAunthaticated(req,2) == false && req.isAuthenticated() == false)
  {
    return res.send("Not aunthiticated").status(403);
  }
     console.log(req.body);
   // var receivedData =  JSON.parse(req.body);

    var indiantime = new Date();
    indiantime.setHours(indiantime.getHours() + 5);
    indiantime.setMinutes(indiantime.getMinutes() + 30);

    return VendorInfoModel.update({ 'username':req.params.id},
          { 
            $addToSet: {inbox: {$each:[{
                        name: req.body.name,
                        phoneno: req.body.phone,
                        emailid:req.body.emailid,
                        time:indiantime,
                        letter: req.body.letter}], }}},
            function( err, order ) 
            {
                if( !err ) {
                  console.log( 'updated inbox' );
                  return res.send('Successfully');
                } 
                else 
                {
                  console.log( 'updated inbox error' );     
                  console.log( err );     
                  return res.send('ERROR');     
                }    
           });    
  });
app.post( '/v2/candidate/suggestion/:id',uploadsuggestion.array('file',1), function( req, res ) {
    console.log("post /v2/candidate/suggestion/");
  if(checkVendorApiAunthaticated(req,2) == false && req.isAuthenticated() == false)
  {
    return res.send("Not aunthiticated").status(403);
  }
     console.log(req.body);
   // var receivedData =  JSON.parse(req.body);
 console.log('files->',req.files);
    console.log('file->',req.file);
     var elem = "";
    //  for (var i = 0; i < req.files.length; i++) {
    
    //   console.log(req.files[i].location);
    //    elem = {url:req.files[i].location};
   

    // }
    //console.log('Successfully uploaded ' + req.files.length + ' files!');

    var indiantime = new Date();
    indiantime.setHours(indiantime.getHours() + 5);
    indiantime.setMinutes(indiantime.getMinutes() + 30);

    return VendorInfoModel.update({ 'username':req.params.id},
          { 
            $addToSet: {inbox: {$each:[{
                        name: req.body.name,
                        phoneno: req.body.phone,
                        emailid:req.body.emailid,
                        time:indiantime,
                        letter: req.body.letter,
                        url:elem}], }}},
            function( err, order ) 
            {
                if( !err ) {
                  console.log( 'updated inbox' );
                  return res.send('Successfully');
                } 
                else 
                {
                  console.log( 'updated inbox error' );     
                  console.log( err );     
                  return res.send('ERROR');     
                }    
           });    
  });

app.get( '/v1/candidate/suggestion/:id', function( request, response ) {
    console.log("GET -'/v1/candidate/suggestion/:id");

    return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendor ) {
        if( !err ) {
            console.log(vendor);
            var new_menu_array = [];
            for (var j = 0; j < vendor.length; j++) {
              var menu_array ;
              menu_array = vendor[j].inbox;
              
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


app.post( '/v1/candidate/register_member/:id', function( req, res ) {
    console.log("post /v1/candidate/register_member/");
  if(checkVendorApiAunthaticated(req,2) == false && req.isAuthenticated() == false)
  {
    return res.send("Not aunthiticated").status(403);
  }
     console.log(req.body);
   // var receivedData =  JSON.parse(req.body);

    var indiantime = new Date();
    indiantime.setHours(indiantime.getHours() + 5);
    indiantime.setMinutes(indiantime.getMinutes() + 30);

    return VendorInfoModel.update({ 'username':req.params.id},
          { 
            $addToSet: {members: {$each:[{
                        name: req.body.name,
                        phoneno: req.body.phone,
                        emailid:req.body.emailid,
                        time:indiantime
                        }], }}},
            function( err, order ) 
            {
                if( !err ) {
                  console.log( 'updated inbox' );
                  return res.send('Successfully');
                } 
                else 
                {
                  console.log( 'updated inbox error' );     
                  console.log( err );     
                  return res.send('ERROR');     
                }    
           });    
  });

app.get( '/v1/candidate/register_member/:id', function( request, response ) {
    console.log("GET -'/v1/candidate/register_member/:id");

    return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendor ) {
        if( !err ) {
            console.log(vendor);
            var new_menu_array = [];
            for (var j = 0; j < vendor.length; j++) {
              var menu_array ;
              menu_array = vendor[j].members;
              
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




app.post( '/v1/comment/info/:id',upload.array('file',5), function( req, res ) {

    if(req.isAuthenticated() == false)
    {
      return res.send("Not aunthiticated").status(403);
    }
    console.log("commentInfo post");
    console.log(req.body);
    console.log(req.params.id);
    console.log('files->',req.files);
    console.log('file->',req.file);
    
    console.log('Successfully uploaded ' + req.files.length + ' files!');
    var imageurls = [];
    var videourls = [];
    var audiourls = [];
    var urlnotfication = "";
    for (var i = 0; i < req.files.length; i++) {
    
      console.log(req.files[i].location);
      var elem = {url:req.files[i].location};
      // var elem[url]  =  req.files[i].location;
      if(req.files[i].mimetype.startsWith("image"))
      {
        imageurls.push(elem);
        urlnotfication = elem;
      }
      else if (req.files[i].mimetype.startsWith("video"))
      {
        videourls.push(elem);
      }
      else if(req.files[i].mimetype.startsWith("audio"))
      {
        audiourls.push(elem);
      }

    }
    console.log(imageurls);
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
      feedimages: imageurls,
      feedvideos: videourls,
      feedaudios: audiourls
      }], }}},
       function( err, order ) {
       if( !err ) {

 console.log("urlnotfication->",urlnotfication);
 var notheading="",notdescription="";
 if(receivedData.heading)
 {
  notheading = receivedData.heading;
 }
  if( receivedData.description)
 {
  notdescription =  receivedData.description;
 }
  console.log("notheading->",notheading);
   console.log("notdescription->",notdescription);
//var image = url2[0].url;
              var topic = req.params.id;
              var payload = {
                 notification: {
                  title:notheading,
                  body: notdescription,
              },  data: {
                   message:  notheading
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


app.post( '/v1/scrollimages/:id',uploadscroll.array('file',1), function( req, res ) {

    if(req.isAuthenticated() == false)
    {
      return res.send("Not aunthiticated").status(403);
    }
    console.log("commentInfo post");
    console.log(req.body);
    console.log(req.params.id);
    console.log('files->',req.files);
    console.log('file->',req.file);
    
    console.log('Successfully uploaded ' + req.files.length + ' files!');

    

    return VendorInfoModel.update({ 'username':req.params.id},
     { $addToSet: {scrollimages: {$each:[{
      url:req.files[0].location}], }}},
     
       function( err, order ) {
       if( !err ) {
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
            //console.log(vendor);
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

app.delete( '/v1/feed/info/:id/:post', function( request, response ) {
  console.log("delete --/v1/feed/info/");
  console.log(request.params.id);
  console.log(request.params.post);
return VendorInfoModel.update( { 'username':request.params.id},
          { $pull: {newsfeed: {"_id": request.params.post }}},
          function( err ) {
            if( !err ) {
                console.log( 'post removed' );
                return response.send( 'Successfully removed' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    //});
});

app.get( '/v2/feed/info/:id', function( request, response ) {
    console.log("GET --/v1/vendor/info/");

    return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendor ) {
        if( !err ) {
            //console.log(vendor);
            var new_menu_array = [];
              var menu_array = {};
              if(vendor.length > 0)
              {
                menu_array['newsfeed'] = vendor[0].newsfeed;
                menu_array['scrollimages'] = vendor[0].scrollimages;
              }
            return response.send( menu_array );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
app.get( '/v1/scrollimages/:id', function( request, response ) {
    console.log("GET --/v1/vendor/info/");

    return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendor ) {
        if( !err ) {
            //console.log(vendor);
            var new_menu_array = [];
              var menu_array = {};
              // if(vendor.length > 0)
              // {
              //   menu_array['scrollimages'] = vendor[0].scrollimages;
              // }
            return response.send( vendor[0].scrollimages);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
app.delete( '/v1/scrollimages/:id/:imageid', function( request, response ) {
  console.log("delete --/v1/feed/info/");
  console.log(request.params.id);
  console.log(request.params.imageid);
return VendorInfoModel.update( { 'username':request.params.id},
          { $pull: {scrollimages: {"_id": request.params.imageid }}},
          function( err ) {
            if( !err ) {
                console.log( 'post removed' );
                return response.send( 'Successfully removed' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    //});
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

                    
                    var feed_videos = menu_array[i].feedvideos;
                    var feed_audios = menu_array[i].feedaudios;

                    var feed_youtubevideos = menu_array[i].feedvideo;
                    if (feed_youtubevideos != null && feed_youtubevideos != "") 
                    {
                          new_feed_images_array.push(menu_array[i]);
                    }
                    else if((feed_videos != null  && feed_videos.length > 0)|| 
                      (feed_audios != null && feed_audios.length > 0))
                    {
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
    console.log("get /v1/admin/counters");
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
app.get( '/v1/pn/vendor/addTofirebase', function( request, response ) {
    console.log("post v1/pn/vendor/addTofirebase");
    console.log(request.body);
 
    //if( request.body.message ) {
            console.log('success');
            var pn = {};
            pn["hdk"]  = {
                info:"request.body.message"
            };
            console.log(pn); // should print  Object { name="John"}
              rootRef.update(
               pn
             );

            return response.send(pn);

     

});
app.get( '/v1/pn/customer/fcm/:id', function( request, response ) {
      console.log("post v1/pn/customer/addTofirebase");
     
      var topic = request.params.id;

// See the "Defining the message payload" section below for details
// on how to define a message payload.
      var payload = {
       notification: {
        title: "Hello World2! ",
        icon: "appicon",
        
        body: "Here is a not2222ification's body.",
    },
  data: {
       image: "https://s3.ap-south-1.amazonaws.com/chunavane/hdk/images.jpg"
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


function checkVendorApiAunthaticated(request,type)
{
  console.log("checkVendorApiAunthaticated 1");
  console.log(request.headers);
  console.log(request.headers.version);
  var version = parseInt(request.headers.version);
  console.log(version);
  var ret = false; 
  if(request.headers.securekey == secureadminkey && request.headers.client == client_key_admin)
  {
    console.log("checkVendorApiAunthaticated admin");
    ret = true;
  }
  else if(request.headers.securekey == securewebkey &&
          request.headers.version == version_value_1 && 
          request.headers.client == client_key_web)
  {
    console.log("checkVendorApiAunthaticated web pass");
    ret = true;
  }
  else if(type == 1)
  {
    console.log("checkVendorApiAunthaticated vendor");
    if(request.headers.securekey == securevendorkey &&
            request.headers.version == version_value_1 && 
            request.headers.client == client_key_vendor)
    {
      console.log("checkVendorApiAunthaticated vendor pass");
      ret = true;
    }
  }
  else if(type == 2)
  {
    console.log("checkVendorApiAunthaticated cust");
    if(request.headers.securekey == securecustomerkey &&
            request.headers.version == version_value_1 && 
            request.headers.client == client_key_customer)
    {
      console.log("checkVendorApiAunthaticated cust pass");
      ret = true;
    }
  }
  else
  {
    console.log("checkVendorApiAunthaticated not auth");
    ret = false;
  }
  return ret;
}


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