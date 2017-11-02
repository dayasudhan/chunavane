
//var ProfileInfoModel = require('../app/models/ProfileInfo');
var VendorInfoModel = require('../app/models/vendorInfo');
var CountersModel = require('../app/models/counters');
var OtpModel = require('../app/models/otp');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var s3Stream = require('s3-upload-stream')(new AWS.S3());
var path = require('path');
var PDF = require('pdfkit'); 
var fs = require('fs'); 
var gm = require('gm').subClass({imageMagick: true});
var htmlConvert = require('html-convert');
var pictureTube = require('picture-tube');
var convert = htmlConvert();
var pdfrequest = require('request');
var Client = require('node-rest-client').Client;
var client = new Client();
var options = multer.diskStorage({ destination : 'public/images/logo/' ,
  filename: function (req, file, cb) {
    cb(null,"photo" +  Date.now() + path.extname(file.originalname));
  }
});
// Load the SDK and UUID

// Create an S3 client
var s3 = new AWS.S3();

//var upload = multer({ storage: options });
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'madhuve',
        acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, req.params.id + '/' + 'main' + Date.now() + path.extname(file.originalname)); //use Date.now() for unique file keys
        }
    })
});

var securecustomerkey = 'EjR7tUPWx7WhsVs9FuVO6veFxFISIgIxhFZh6dM66rs';
var securevendorkey = 'ORql2BHQq9ku8eUX2bGHjFmurqG84x2rkDQUNq9Peelw';
var secureadminkey = 'tk0M6HKn0uzL%2FcWMnq3jkeF7Ao%2BtdWyYEJqPDl0P6Ac';
var securewebkey = 'RN4CDXkqltLF%2FWloegKujIhiaSWBrgCzQXqI9cyWpT0';
var version_value_1 = '1';
var client_key_vendor = 'tunga';
var client_key_customer = 'bhoomika';
var client_key_admin = 'gajanuru';
var client_key_web = 'pickcock';



module.exports = function(app, passport) {



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

app.get('/vendor_logout', function(req, res) {
    var redirect_url = '/';
    req.logout();
    res.redirect(redirect_url);
});
app.get('/login', function (req, res) {
    res.render('login', { user : req.user });
});
// app.get('/', function (req, res) {
//     res.render('login', { user : req.user });
// });
app.get('/', function (req, res) {
    if(req.isAuthenticated())
        res.render('home', { user : req.user });
    else
        res.render('home', { user : "dummy" });
});

app.get('/admin_signup', function(req, res) {
    res.render('admin_signup', { });
});
app.get('/settings', function(req, res) {
    res.render('settings', { user : req.user });
});
app.get('/search', function(req, res) {
    res.render('search', { user : req.user });
});
app.get('/admin_add_details', function(req, res) {
    res.render('admin_add_details', { user : req.user });
});
app.get('/add_profile', function (req, res) {
    res.render('add_profile', { user : req.user });
});
app.get('/profile/:position/:gender/:community/:age/:maritalstatus/:education/:mothertongue', function (req, res) {
    //res.render('profile', { user : req.user,
    //  position:req.params.position });
    console.log(req.params.position);
    console.log(req.params.gender);
    console.log(req.params.community);
    console.log(req.params.age);
    console.log(req.params.maritalstatus);
    console.log(req.params.education);
    console.log(req.params.mothertongue);
    res.render('profile', { user : req.user,
      position:req.params.position,
      gender:req.params.gender,
      community:req.params.community,
      age:req.params.age,
      maritalstatus:req.params.maritalstatus,
      education:req.params.education,
      mothertongue:req.params.mothertongue
      });
});
app.get('/profile_list/:position/:gender/:community/:age/:maritalstatus/:education/:mothertongue', function (req, res) {
    //res.render('profile', { user : req.user,
    //  position:req.params.position });
    console.log(req.params.position);
    console.log(req.params.gender);
    console.log(req.params.community);
    console.log(req.params.age);
    console.log(req.params.maritalstatus);
    console.log(req.params.education);
    console.log(req.params.mothertongue);
    
    res.render('profile_list', { user : req.user,
      position:req.params.position,
      gender:req.params.gender,
      community:req.params.community,
      age:req.params.age,
      maritalstatus:req.params.maritalstatus,
      education:req.params.education,
      mothertongue:req.params.mothertongue
       });
});
app.get('/guest_profile/:profileId/:position/:gender/:community/:age/:maritalstatus/:education/:mothertongue', function (req, res) {
    //res.render('profile', { user : req.user,
    //  position:req.params.position });
    console.log(req.params.position);
    console.log(req.params.gender);
    console.log(req.params.community);
    console.log(req.params.age);
    console.log(req.params.maritalstatus);
    console.log(req.params.education);
    console.log(req.params.mothertongue);
    res.render('guest_profile', { profileId : req.params.profileId,
      position:req.params.position,
      gender:req.params.gender,
      community:req.params.community,
      age:req.params.age,
      maritalstatus:req.params.maritalstatus,
      education:req.params.education,
      mothertongue:req.params.mothertongue
      });
});
app.get('/guest_profile_list/:profileId/:position/:gender/:community/:age/:maritalstatus/:education/:mothertongue', function (req, res) {
    //res.render('profile', { user : req.user,
    //  position:req.params.position });
    console.log(req.params.position);
    console.log(req.params.profileId);
    console.log(req.params.gender);
    console.log(req.params.community);
    console.log(req.params.age);
    console.log(req.params.maritalstatus);
    console.log(req.params.education);
    console.log(req.params.mothertongue);
    
    res.render('guest_profile_list', { 
      profileId : req.params.profileId,
      position:req.params.position,
      gender:req.params.gender,
      community:req.params.community,
      age:req.params.age,
      maritalstatus:req.params.maritalstatus,
      education:req.params.education,
      mothertongue:req.params.mothertongue
       });
});
// app.get('/profile_list', function (req, res) {

//     res.render('profile_list', { user : req.user });
// });
app.post('/login', function(req, res, next) {
    console.log('post /login');
      console.log(req.body);
  passport.authenticate('local-login', function(err, user, info) {
   
    if (err) {
         console.log("error in login 0");
        return next(err); }
    if (!user) {
         var redirect_url = '/';
           if(req.body.role == 'vendor') 
            {
                redirect_url = '/search';
                return res.redirect(redirect_url); 
            } 
            
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log(req.body.role);
      var redirect_url = '/';
      if(req.body.role == 'vendor') 
      {
          redirect_url = '/search';
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
      // storeVendoruniqueId(req,res,function(req,res){
      //      console.log("storeVendoruniqueId success");
           
      //   }); 
      return res.send("1");
    });
    console.log('post /v1/m/login 5');
  })(req, res, next);
});

app.post('/signup', function(req, res, next) {
console.log(req.body);
  if(req.body.adminpassword != "devknvl")
  {
     
      console.log("Admin password mimatchmatch");
     return res.send('Admin Not Aunthiticated');
  }
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
          var redirect_url = '/';
              if(req.body.role == 'vendor') 
              {
                  redirect_url = '/admin_signup';
              } 
              return res.redirect(redirect_url); 
       }
       else
       {
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          console.log(req.body.role);
          var redirect_url;
          if(req.body.role == 'vendor') 
          {
            redirect_url = '/admin_add_details';
            registerVendor(req, res, next);
            return res.redirect(redirect_url);
          }
          else
          {
            return res.redirect(redirect_url);
          }
        });
    }
    })(req, res, next);
});

function registerVendor(req, res, next) {
  console.log("/registerVendor");
  var hotel_id = "M";
  var res = getNextSequence('vendor',function(data) {

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

app.post( '/v1/vendor/info/:id', function( req, res ) {
// if(checkVendorApiAunthaticated(req,1) == false && req.isAuthenticated() == false)
// {
//   return res.send("Not aunthiticated").status(403);
// }
  console.log("VendorInfo post");
  console.log(req.body);
            storeVendorInfo(req,res,function(req,res){
           console.log("storeVendorInfo success");
           
        });

  });
function storeVendorInfo(request,response,callback,param)
{
console.log("storeVendorInfo");
console.log(request.params.id);

 VendorInfoModel.update({ 'username':request.params.id},
      {
        email: req.body.email,
        name:req.body.name,
        phone: req.body.phone, 
        address:{
          addressLine1:request.body.Address1,
          addressLine2:request.body.Address2,
          street:request.body.street, 
          LandMark:request.body.Landmark, 
          areaName:request.body.Areaname,
          city:request.body.City, 
          zip:request.body.zip, 
          latitude:request.body.latitude,
          longitude:request.body.longitude }
      },
       function( err ) {
        if( !err ) {
            console.log( 'storeVendorInfo created' );
            callback(request,response);
            return ;
        } else {
         console.log( 'storeVendorInfo error' );
            console.log( err );
            return response.send('ERROR');
        }
    });
}


app.post( '/v1/vendor/logo/:id', upload.single('file'),function( req, res ) {
  console.log(req.params.id);
  console.log(req.files);
  console.log(req.file);
  console.log(req.file.path);
  console.log("VendorLogo post");
  console.log(req.body);
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  var sampleFile;
  sampleFile = req.file;
 var destination  = req.file.destination;

  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('/public/images/logo/filename.jpg', function(err) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.send('File uploaded!');
    }
  });
  VendorInfoModel.update({ 'username':req.params.id},
      {
        $set: { "logo": req.file.path } ,
       
      },
       function( err ) {
        if( !err ) {
            console.log( 'updated logo created' );
           
            return res.send('created');;
        } else {
         console.log( 'updated logo error' );
            console.log( err );
            return res.send('ERROR');
        }
    });
});

app.post( '/v1/profile/:id', function( request, response ) {

  console.log(request.body);
 // console.log(request.user.local.email);
  // if(checkVendorApiAunthaticated(request,2) == false && request.isAuthenticated() == false)
  // {
  //   return response.send("Not aunthiticated").status(403);
  // }
  var res = getNextSequence('profile',function(data) {
    var order_id = "M1" ;
    order_id = order_id + "P";
     order_id = order_id + data.sequence;
    console.log(order_id);
    var indiantime = new Date();
    indiantime.setHours(indiantime.getHours() + 5);
    indiantime.setMinutes(indiantime.getMinutes() + 30);
    var dc;
    return VendorInfoModel.update({ 'username':request.params.id},
       { $addToSet: {profiles: {$each:[{
            id:order_id,
            name: request.body.name,
            email: request.body.email,
            phone: request.body.phone ,
            dob: indiantime, 
             gender: request.body.gender, 
             occupation: request.body.occupation, 
             education: request.body.education, 
             summary: request.body.summary,
             date:indiantime,
             community:request.body.cast,
             address:{
               addressLine1:request.body.Address1,
               addressLine2:request.body.Address2,
               street:request.body.street, 
               LandMark:request.body.Landmark, 
               areaName:request.body.Areaname,
               city:request.body.City 
             }
          }], }}},
       function( err, order ) {
       if( !err ) {
           console.log("no error");
           console.log(order);
            console.log("no error2 ");
           return response.send('Success');
       } else {
           console.log( err );
           return response.send('ERROR');
       }
   });
        console.log('post order');
    });
 });


app.post( '/v1/profile2/:id', upload.single('file'),function( request, response ) {

  console.log(request.body);
  console.log(request.body.data);
  var receivedData =  JSON.parse(request.body.data);
  console.log(receivedData);
  console.log(receivedData.name);
  console.log(request.params.id);
   console.log(request.body.data.name);
  console.log(request.files);
  console.log(request.file);
  console.log(request.file.path);
  console.log("VendorLogo post");
 
var url2 = request.file.location;
console.log(url2);


  var res = getNextSequence('profile',function(data) {
    var order_id = receivedData.vendorId ;
    order_id = order_id + "P";
    order_id = order_id + data.sequence;
    console.log(order_id);




    createProfile(request,order_id,url2,receivedData,function(profile_url){


    var dc;
    return VendorInfoModel.update({ 'username':request.params.id},
       { $addToSet: {profiles: {$each:[{
            id:order_id,
            name: receivedData.name,
            email: receivedData.email,
            phone: receivedData.phone ,
            gender: receivedData.gender, 
            occupation: receivedData.occupation, 
            education: receivedData.education, 
            summary: receivedData.summary,
            community:receivedData.cast,
            father:{
                    name:receivedData.fathername,
                    occupation:receivedData.fatheroccupation},
            mother:{
                    name:receivedData.mothername,
                    occupation:receivedData.motheroccupation},
            mothertongue:receivedData.mothertongue,
            income:receivedData.income,
            gothra:receivedData.gothra,
            star:receivedData.star,
            rashi:receivedData.rashi,
            height:receivedData.height,
            weight:receivedData.weight,
            origin:receivedData.origin,
            dob:receivedData.dob,
            age:receivedData.age,
            otherDetails:receivedData.otherDetails,
            logo:url2,
            profileLogo:profile_url,
            address:{
             addressLine1:receivedData.Address1,
             addressLine2:receivedData.Address2,
             street:receivedData.street, 
             LandMark:receivedData.Landmark, 
             areaName:receivedData.Areaname,
             city:receivedData.city 
            },
            maritalstatus:receivedData.maritalstatus,
            complexion:receivedData.complexion,
            state:receivedData.state,
            native:receivedData.native,
            castdetails:receivedData.castdetails,
            padha:receivedData.padha,
            lagna:receivedData.lagna,
            gothradetails:receivedData.gothradetails,
            homegod:receivedData.homegod,
            religionotherdetails:receivedData.religionotherdetails,
            educationdetails:receivedData.educationdetails,
            occupationdetails:receivedData.occupationdetails,
            joblocation:receivedData.joblocation,
            brotherdetails:receivedData.brotherdetails,
            sisterdetails:receivedData.sisterdetails,
            birthplace:receivedData.birthplace,
            horoscope:receivedData.horoscope
          
          }], }}},
       function( err, order ) {
       if( !err ) {
           console.log("no error");
           console.log(order);

            console.log("no error2 ");
           return response.send('Success');
       } else {
           console.log( err );
           return response.send('ERROR');
       }
      });
        console.log('post order');
      });
    });
 });
app.get( '/v1/profile/all', function( request, response ) {
    console.log('/v1/profile/all');
  return VendorInfoModel.find(function( err, order ) {
        if( !err ) {
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });

});
app.get( '/v1/center/info/id/:id', function( request, response ) {
    console.log('/v1/center/info/id');
    console.log(request.params.id);
     
   return VendorInfoModel.find({ 'id':request.params.id},
      function( err, profile_array ) {
        if( !err ) {
          var centerInfo ={} ;
            if(profile_array.length > 0)
            {
              centerInfo.name = profile_array[0].name;
              centerInfo.id = profile_array[0].id;
              centerInfo.username = profile_array[0].username;
              centerInfo.email = profile_array[0].email;
              centerInfo.phone = profile_array[0].phone;
              centerInfo.logo = profile_array[0].logo;
              centerInfo.community = profile_array[0].community;
            }
            else
              centerInfo =  profile_array ;
           return response.send(centerInfo);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
app.get( '/v1/profile/info/:id', function( request, response ) {
    console.log('/v1/profile/info');
    console.log(request.params.id);
     
  return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendorinfo ) {
        if( !err ) {
             console.log("no error");
             var profile_array ;
            if(vendorinfo.length > 0)
              profile_array = vendorinfo[0].profiles;
            else
              profile_array =  vendorinfo ;
            return response.send(profile_array);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});


app.get( '/v1/profile/info2/:id', function( request, response ) {
    console.log('/v1/profile/info');
    console.log(request.params.id);
     
  return VendorInfoModel.find({ 'username':request.params.id},
      function( err, profile_array ) {
        if( !err ) {
            
            return response.send(profile_array);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

app.get( '/v1/profile/info/:id/:gender/:community/:minage/:maxage', function( request, response ) {
    console.log('/v1/profile/info');
    console.log(request.params.id);
     console.log(request.params.gender);
     console.log(request.params.community);
     console.log(request.params.minage);
     console.log(request.params.maxage);
  return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendorinfo ) {
        if( !err ) {
             console.log("no error");
             var profile_array ;
              var ret_profile_array = [];
            if(vendorinfo.length > 0)
            {
              profile_array = vendorinfo[0].profiles;
             console.log('test 1');
             
              for (var j = 0; j < profile_array.length; j++) {
                
                if((profile_array[j].gender == request.params.gender 
                  || request.params.gender == 'all') &&
                  (profile_array[j].community == request.params.community ||
                   request.params.community == 'all') &&
                   (profile_array[j].age >= request.params.minage && 
                    profile_array[j].age <= request.params.maxage)) 
                {
                  
                  ret_profile_array.push(profile_array[j])
                }
              }
            }
            else
            {
              ret_profile_array =  vendorinfo ;
            }

            return response.send(ret_profile_array);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

app.get( '/v1/profile/info2/:id/:gender/:community/:minage/:maxage', function( request, response ) {
    console.log('/v1/profile/info2');
    console.log(request.params.id);
     console.log(request.params.gender);
     console.log(request.params.community);
     console.log(request.params.minage);
     console.log(request.params.maxage);
  return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendorinfo ) {
        if( !err ) {
             console.log("no error");
             var profile_array ;
              var ret_profile_array = [];
            if(vendorinfo.length > 0)
            {
              profile_array = vendorinfo[0].profiles;
             console.log('test 1');
             
              for (var j = 0; j < profile_array.length; j++) {
                
                if((profile_array[j].gender == request.params.gender 
                  || request.params.gender == 'all') &&
                  (profile_array[j].community == request.params.community ||
                   request.params.community == 'all') &&
                   (profile_array[j].age >= request.params.minage && 
                    profile_array[j].age <= request.params.maxage)) 
                {
                  
                  ret_profile_array.push(profile_array[j])
                }
              }
              vendorinfo[0].profiles = ret_profile_array;
            }
            // else
            // {
            //   ret_profile_array =  vendorinfo ;
            // }

            return response.send(vendorinfo);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});


app.get( '/v2/profile/info2/:id/:gender/:community/:minage/:maxage/:maritalstatus/:education/:mothertongue', function( request, response ) {
    console.log('/v1/profile/info2');
    console.log(request.params.id);
     console.log(request.params.gender);
     console.log(request.params.community);
     console.log(request.params.minage);
     console.log(request.params.maxage);
     console.log(request.params.maritalstatus);
     console.log(request.params.education);
     console.log(request.params.mothertongue);
  return VendorInfoModel.find({ 'username':request.params.id},
      function( err, vendorinfo ) {
         if( !err ) {
             console.log("no error");
             var profile_array ;
              var ret_profile_array = [];
            if(vendorinfo.length > 0)
            {
              profile_array = vendorinfo[0].profiles;
             console.log('test 1');
             
              for (var j = 0; j < profile_array.length; j++) {
                
                if((profile_array[j].gender == request.params.gender 
                  || request.params.gender == 'all') &&
                  (profile_array[j].community == request.params.community ||
                   request.params.community == 'all') &&
                   (profile_array[j].age >= request.params.minage && 
                    profile_array[j].age <= request.params.maxage)
                    &&(profile_array[j].maritalstatus == request.params.maritalstatus ||
                   request.params.maritalstatus == 'all')
                    &&(profile_array[j].education == request.params.education ||
                   request.params.education == 'all')
                    &&(profile_array[j].mothertongue == request.params.mothertongue ||
                   request.params.mothertongue == 'all')
                   ) 
                {
                  
                  ret_profile_array.push(profile_array[j])
                }
              }
              vendorinfo[0].profiles = ret_profile_array;
            }
            return response.send(vendorinfo);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
app.post( '/v1/admin/counters/:id', function( request, response ) {
    console.log("post /v1/admin/counters");
  //   if(checkVendorApiAunthaticated(request,0) == false)
  // {
  //   return response.send("Not aunthiticated").status(403);
  // }
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

app.post( '/v1/profile/logo/:id', upload.single('file'),function( req, res ) {
  console.log(req.params.id);
  console.log(req.files);
  console.log(req.file);
  console.log(req.file.path);
  console.log("VendorLogo post");
  console.log(req.body);
var url2 = req.protocol + '://' + req.get('host') +'\\' + req.file.path;
console.log(url2);
  VendorInfoModel.update({ 'id':req.params.id},
      {
         $addToSet: {logo: {$each:[{url: url2}] }}
       
      },
       function( err ) {
        if( !err ) {
            console.log( 'updated logo created' );
           
            return res.send('created');;
        } else {
         console.log( 'updated logo error' );
            console.log( err );
            return res.send('ERROR');
        }
    });
});
app.get( '/v1/guest/profile/info/:id', function( request, response ) {
    console.log('/v1/profile/info');
    console.log(request.params.id);
  return VendorInfoModel.find({ 'id':request.params.id},
      function( err, vendorinfo ) {
         if( !err ) {
             console.log("no error");
             var profile_array ;
              var ret_profile_array = [];
            if(vendorinfo.length > 0)
            {
              profile_array = vendorinfo[0].profiles;
              console.log('test 1');
             
              for (var j = 0; j < profile_array.length; j++) {
                
                var json_obj = profile_array[j];
                var jsonnewobj =new Object();
                for(var myKey in json_obj) {
                  if(myKey == "phone" || myKey == "email" ||myKey == "name" )
                  {
                    jsonnewobj[myKey] = null;
                  }
                  else if(myKey == "address" )
                  {
                   jsonnewobj[myKey] = null; 
                  }
                  else
                  {
                    jsonnewobj[myKey] = json_obj[myKey];
                  }
                }
                console.log(jsonnewobj);
                ret_profile_array.push(jsonnewobj);
              }
              vendorinfo[0].profiles = ret_profile_array;
            }
            return response.send(vendorinfo);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

app.get( '/v1/guest/profile/info/:id/:gender/:community/:minage/:maxage/:maritalstatus/:education/:mothertongue', 
  function( request, response ) {
    console.log('/v1/profile/info');
    console.log(request.params.id);
    console.log(request.params.gender);
    console.log(request.params.community);
    console.log(request.params.minage);
    console.log(request.params.maxage);
    console.log(request.params.maritalstatus);
    console.log(request.params.education);
    console.log(request.params.mothertongue);
   return VendorInfoModel.find({ 'id':request.params.id},
      function( err, vendorinfo ) {
         if( !err ) {
             console.log("no error");
             var profile_array ;
             var ret_profile_array = [];
            if(vendorinfo.length > 0)
            {
             profile_array = vendorinfo[0].profiles;
             console.log('test 1');
             
              for (var j = 0; j < profile_array.length; j++) {
                
                if((profile_array[j].gender == request.params.gender 
                  || request.params.gender == 'all') &&
                  (profile_array[j].community == request.params.community ||
                   request.params.community == 'all') &&
                   (profile_array[j].age >= request.params.minage && 
                    profile_array[j].age <= request.params.maxage)
                    &&(profile_array[j].maritalstatus == request.params.maritalstatus ||
                   request.params.maritalstatus == 'all')
                    &&(profile_array[j].education == request.params.education ||
                   request.params.education == 'all')
                    &&(profile_array[j].mothertongue == request.params.mothertongue ||
                   request.params.mothertongue == 'all')
                   ) 
                {
                  
                     var json_obj = profile_array[j];
                      var jsonnewobj =new Object();
                      for(var myKey in json_obj) {
                        if(myKey == "phone" || myKey == "email" ||myKey == "name" )
                        {
                          jsonnewobj[myKey] = null;
                        }
                        else if(myKey == "address" )
                        {
                         jsonnewobj[myKey] = null; 
                        }
                        else
                        {
                          jsonnewobj[myKey] = json_obj[myKey];
                        }
                      }
                      console.log(jsonnewobj);
                      ret_profile_array.push(jsonnewobj);
                  
                }
              }
              vendorinfo[0].profiles = ret_profile_array;
            }
            return response.send(vendorinfo);
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

app.post( '/v1/profile/pdf/:id', function( request, response ) {
    console.log("post /v1/profile/pdf");
  doc = new PDF();
  doc.pipe(fs.createWriteStream('public/images/pdf/pdftesting_file.pdf'));
//Now this is the code snippet to get the image using the url
  console.log("post /v1/profile/pdf 2");
            pdfrequest({
                url: 'http://localhost:3000/public/images/logo/M1P2.jpg',
                encoding: null // Prevents Request from converting response to string
              }, function(err, response, body) {
              if (err){ 
                 console.log("post /v1/profile/pdf 3");
                throw err;
              }

              console.log("post /v1/profile/pdf 4");
              doc.image(body,10, 10,{height:250,width:250});
              doc.text('HOLIDAYS - 125 Fortime',80,165,{align:'center'})
              doc.text('Hello this is a demo file',100,200)
              console.log("post /v1/profile/pdf 5");

              doc.end();  
              console.log("post /v1/profile/pdf 6");
             
    });

});


  app.post( '/v1/profile/image/:id', function( request, response ) {
      console.log("post /v1/profile/image");

     var input =  'public/images/pdf/ramya.jpg';
     var output =  'public/images/pdf/r2.jpg';
     var writeStream = fs.createWriteStream(output);
     var Readable = require('stream').Readable


    var src1  = '<!DOCTYPE html><html><head><style>body {    background-color: #93B874;}</style></head><body><img src="http://localhost:3000/public/images/pdf/ramya.jpg"width="300" height="500"><h1>Dayasudhan kuruva</h1></body></html>';
    var s = new Readable
    s.push(src1)    // the string you want
    s.push(null) ;
    s.pipe(convert({format:'jpeg'}))
      .pipe(writeStream);
//https://www.npmjs.com/package/s3-write-stream
       return response.send("Success");
  });
    function convertInches(inches) {
      var feetFromInches = Math.floor(inches / 12);//There are 12 inches in a foot
      var inchesRemainder = inches % 12;
   
      var result = feetFromInches + " ft " + inchesRemainder + " in";
      console.log(result);
      return result;
    }
  function createProfile( request,order_id,path,receivedData, result ) {
    console.log(order_id);
    console.log(path);
      console.log("post /v1/profile/image");
      var logopath = receivedData.vendorlogo;
      console.log(logopath);
// var input = 'public/images/logo/';
// input  = input + path;
   
    var output = request.params.id + '/' + 'profile' + Date.now() + '.jpg';
     console.log(output);
 
var name = "daya";
var htmloccupation,htmlmothertongue,htmlincome,htmlgothra,htmlstar,htmlrashi,htmlheight,htmlweight;
var htmlvendorname,htmlvendorphone,htmlvendoremail;
var htmlcast,htmleducation;
if(receivedData.mothertongue){htmlmothertongue = receivedData.mothertongue;}
else{  htmlmothertongue = "";}
if(receivedData.occupation){ htmloccupation= receivedData.occupation;}
else{  htmloccupation = "";}
if(receivedData.occupationdetails)
{
  htmloccupation = htmloccupation + '(' + receivedData.occupationdetails + ')';
}
if(receivedData.educationdetails)
{
  htmleducation = receivedData.education + '(' + receivedData.educationdetails + ')';
}
if(receivedData.castdetails)
{
  htmlcast = receivedData.cast + '(' + receivedData.castdetails + ')';
}
if(receivedData.income){htmlincome = receivedData.income;
htmlincome = htmlincome + " " + 'per annum'}
else{  htmlincome = "";}
if(receivedData.gothra){htmlgothra = receivedData.gothra;}
else{  htmlgothra = "";}
if(receivedData.star){htmlstar = receivedData.star;}
else{  htmlstar = "";}
if(receivedData.rashi){htmlrashi = receivedData.rashi;}
else{  htmlrashi = "";}
if(receivedData.weight){htmlweight = receivedData.weight;}
else{  htmlweight = "";}
if(receivedData.height){htmlheight = convertInches(receivedData.height);}
else{  htmlheight = "";}
if(receivedData.vendorName){htmlvendorname = receivedData.vendorName;}
else{  htmlvendorname = "";}
if(receivedData.vendorPhone){htmlvendorphone = receivedData.vendorPhone;}
else{  htmlvendorphone = "";}
if(receivedData.vendorEmail){htmlvendoremail = receivedData.vendorEmail;}
else{  htmlvendoremail = "";}





var src1  = '<!doctype html>\
<html>\
<head>\
    <title>Mini Matrimony Profile</title>\
    <style>\
        h1 {\
            font-size: 32px;\
            text-align: center;\
        }\
         .container {\
            width: 100%;\
            height: auto;\
            margin: 0px auto;\
        }\
        .clearfix:before,\
        .clearfix:after {\
            display: table;\
            content: " ";\
        }\
        .clearfix:after {\
            clear: both;\
        }\
        .panel {\
            background-color: #fff;\
            border: 1px solid black;\
            border-radius: 4px;\
            width: 1000px;\
            margin: 0px auto;\
            float: none;\
        }\
        .panel-image {\
            padding: 5px;\
            width: 400px;\
            box-sizing: border-box;\
        }\
        .panel-image img {\
            max-width: 100%;\
        }\
        .panel-information {\
            padding: 5px;\
            width: 600px;\
            box-sizing: border-box;\
        }\
        .panel-heading {\
            color: black;\
            background-color: #eeeeee;\
            float: left;\
            width: 100%;\
            text-align: center;\
        }\
        .panel-heading h2 {\
            font-size: 22px;\
        }\
        .panel-body {\
        }\
        .pull-left {\
            float: left;\
        }\
        .pull-right {\
            float: right;\
        }\
        .table {\
            border-collapse: collapse;\
            width: 100%;\
        }\
        td {\
            border: 1px solid #dddddd;\
            text-align: left;\
            padding: 8px;\
            font-size: 28px;\
        }\
        tr:nth-child(even) {\
            background-color: #eeeeee;\
        }\
        body{\
          background-color: #eeeeee;\
          }\
        bloc1, bloc2\
        {\
          display:inline;\
        }\
    </style>\
</head>\
<body>\
<div class="flex-container">\
    <div class="container clearfix">\
      <div class="panel-heading">\
        <div class="pull-left">\
          <div id="bloc1"><img src="' + logopath + '" height= 100 />\</div>\
          <div id="bloc2"><h2><b>' + htmlvendorname + '</b></h2></div>\
        </div>\
        <div class="pull-right">\
          <h3 class="box-right">Phone: ' + htmlvendorphone + '</h3>\
          <h3 class="box-right">Email: ' + htmlvendoremail + '</h3>\
        </div>\
    </div>\
        <div class="panel clearfix">\
            <div class="panel-image pull-left">\
                  <img src="' + path + '" height= 600 />\
            </div>\
            <div class="panel-information pull-left">\
                <div class="panel-body">\
                    <table class="table">\
                        <tbody>\
                            <tr>\
                                <td><b>Profile ID:</b></td>'
                               +'<td>' + order_id  + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Name</b></td>'
                                +'<td>' + receivedData.name + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Cast</b></td>'
                                +'<td>' + htmlcast + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>DOB</b></td>'
                               +'<td>' + receivedData.dob + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Education</b></td>'
                                +'<td>' + htmleducation + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Mother Tongue</b></td>'
                                +'<td>' + htmlmothertongue + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Occupation</b></td>'
                                +'<td>' + htmloccupation + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Salary</b></td>'
                               +'<td>' + htmlincome + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Gothra</b></td>'
                                +'<td>' + htmlgothra + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Star</b></td>'
                                +'<td>' + htmlstar + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Rashi</b></td>'
                               +'<td>' + htmlrashi + '</td>\
                            </tr>\
                            <tr>\
                                <td><b>Height</b></td>'
                               +'<td>' + htmlheight + '</td>\
                            </tr>\
                        </tbody>\
                    </table>\
                </div>\
            </div>\
        </div>\
      </div>\
    </div>\
</body>\
</html>';

var upload = s3Stream.upload({
  Bucket: "madhuve",
  Key: output,
  ACL: "public-read"
});
//
  //  var writeStream = fs.createWriteStream(output);
    var Readable = require('stream').Readable
    var s = new Readable
    s.push(src1)    // the string you want
    s.push(null) ;

    s.pipe(convert({format:'jpeg',width: 1000, height: 600}))
      .pipe(upload);
    var ret_url = "https://madhuve.s3.amazonaws.com/" + output;
    result(ret_url);
     //  return response.send("Success");
  };

//Delete a menu item
app.delete( '/v1/profile/:id/:profileid', function( request, response ) {
     console.log('delete /v1/profile/:id/:profileid');
    
     console.log(request.params.id);
     console.log(request.params.profileid);
        return VendorInfoModel.update( { 'username':request.params.id},
          { $pull: {profiles: {"id": request.params.profileid }}},
          function( err ) {
            if( !err ) {
                console.log( 'profile removed' );
                return response.send( 'Successfully removed' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    //});
});



app.post( '/v1/aws/s3/createbucket', function( request, response ) {
    console.log("/v1/aws/s3/test");

    // Create a bucket and upload something into it
    var bucketName = 'node-sdk-sample2';
   
    // Create params for S3.createBucket
    var bucketParams = {
      Bucket : 'madhuve',
      ACL : 'public-read'
    };

    // call S3 to create the bucket
    s3.createBucket(bucketParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Location);
      }
    });
});


app.get('/sign-s3', function(req, res) {
 var bucketName = 'matrimony';
var keyName = 'hello_world123.txt';
var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World devraj!'};
  s3.putObject(params, function(err, data) {
    if (err)
      console.log(err)
    else
      console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
  });

    // var params = {Bucket: 'devraj', Key: 'key', Body: 'body'};
    // var url = s3.getSignedUrl('putObject', params);
    // console.log('The URL is', url);
     });

app.post( '/v1/admin/update/:id', upload2.single('file'), function( req, res ) {
  console.log('/v1/admin/update/:id');
var url2 = req.file.location;
var receivedData =  JSON.parse(req.body.data);
console.log(url2);
  VendorInfoModel.update({ 'username':req.params.id},
      {
        $set: {
                name: receivedData.name, 
                email: receivedData.email,
                phone: receivedData.phone,
                logo:url2} 
      },
       function( err ) {
        if( !err ) {
            console.log( 'updated isopen created' );
           
            return res.send('created');;
        } else {
    console.log( 'updated isopen error' );     
               console.log( err );     
               return res.send('ERROR');     
           }    
           });    
 });
app.post( '/v1/vendor/update/community/:id',  function( req, res ) {
  console.log('/v1/vendor/update/community/:id');
  console.log(req.body);
  VendorInfoModel.update({ 'username':req.params.id},
     { $addToSet: {'community': {$each:[{name: req.body.community}] }}},
       function( err ) {
        if( !err ) {
            console.log( 'updated community' );
           
            return res.send('Successfully');;
        } else {
    console.log( 'updated community error' );     
               console.log( err );     
               return res.send('ERROR');     
           }    
           });    
 });

app.post( '/v1/vendor/update/mothertongue/:id',  function( req, res ) {
  console.log('/v1/vendor/update/mothertongue/:id');
  VendorInfoModel.update({ 'username':req.params.id},
     { $addToSet: {'mothertongue': {$each:[{name: req.body.mothertongue}] }}},
       function( err ) {
        if( !err ) {
            console.log( 'updated mothertongue' );
           
            return res.send('Successfully');;
        } else {
    console.log( 'updated mothertongue error' );     
               console.log( err );     
               return res.send('ERROR');     
           }    
           });    
 });

//var nodemailer = require("nodemailer");

var TO_ADDRESS = 'dayasudhankg@gmail.com';
var FROM_ADDRESS = 'kuruvatechnologies@gmail.com';

// create reusable transport method (opens pool of SMTP connections)
// var smtpTransport = nodemailer.createTransport("SMTP",{
//     service: 'Gmail',
//     auth: {
//         user: 'kuruvatechnologies@gmail.com',
//         pass: 'jayammafromsidlipura'
//     }
// });
// var sendMail = function(toAddress, subject, content, next){
//   var mailOptions = {
//     from: "SENDERS NAME <" + FROM_ADDRESS + ">",
//     to: toAddress,
//     replyTo: fromAddress,
//     subject: subject,
//     html: content
//   };

//   smtpTransport.sendMail(mailOptions, next);
// };
app.get( '/v1/email/:path', function( req, res ) {
  console.log("Email sending");
// var path = req.params.path;
// path = 'https://s3.amazonaws.com/madhuve/test3/profile1486566499745.jpg'
// var image_html = '<!DOCTYPE html>\
//                   <html>\
//                   <body>\
//                  <img src="' + path + '"/>\
//                   </body>\
//                   </html>';

//   var mailOptions = {
//     from: "Matrimony <" + FROM_ADDRESS + ">",
//     to: TO_ADDRESS,
//     replyTo: FROM_ADDRESS,
//     subject: 'subject',
//     html: image_html
//   };

// smtpTransport.sendMail(mailOptions,function(err, response){
//         if(err){
//           console.log('ERROR!');
//           console.log(err);
//           return res.send('ERROR');
//         }
//         console.log('Email sent!');
//         res.send("Email sent!");
//       });

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




//module.exports = router;
