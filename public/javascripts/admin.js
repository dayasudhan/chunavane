app = angular.module("adminModule", []);
  app.controller("adminController", function ($scope, $http, jsonFilter)
  {
  		 $scope.total2 = 123;
  	      var config = {	    		  
  	    		  headers: {
      		    'securekey': 'RN4CDXkqltLF%2FWloegKujIhiaSWBrgCzQXqI9cyWpT0',
  				    'client':'pickcock',
  				    'version':'1'
  				  }
  	      };
  	  $scope.getOrders = function () {
      console.log("getOrders");

      var url = "/v1/admin/order_all";
      //url = url + param;
      $http.get(url,config)
        .success(function (data, status, headers, config)
        {
          $scope.orderlist = data;
          $scope.total2 = data.length;

        angular.forEach($scope.orderlist, function(item) {
          var timestamp = item._id.toString().substring(0,8);
          item.date = new Date( parseInt( timestamp, 16 ) * 1000 );
        //  item.date.setTimezone("Asia/kolkata");
          console.log(item._id);
         console.log(item.date);
        });
       console.log("timestamp 2");
        })
        .error(function (data, status, headers, config)
        {
          $scope.simpleGetCallResult = logResult("GET ERROR", data, status, headers, config);
        });
    };
	  $scope.getTodayOrders = function () {
	      console.log("getTodayOrders");


	      var url = "/v1/vendor/orderall/today";
	      //url = url + param;
	      $http.get(url,config)
	        .success(function (data, status, headers, config)
	        {
	          $scope.orderlist = data;
	          $scope.total2 = data.length;

	        angular.forEach($scope.orderlist, function(item) {
	          var timestamp = item._id.toString().substring(0,8);
	          item.date = new Date( parseInt( timestamp, 16 ) * 1000 );
	        //  item.date.setTimezone("Asia/kolkata");
	          console.log(item._id);
	         console.log(item.date);
	        });
	       console.log("timestamp 2");
	        })
	        .error(function (data, status, headers, config)
	        {
	          $scope.simpleGetCallResult = logResult("GET ERROR", data, status, headers, config);
	        });
	    };

    $scope.getDetails = function (param) {
      console.log("getDetails");
      console.log(param);
     
      var url = "/v1/vendor/info/";

      url = url + param;
      // $http.get(url)
      //   .success(function (data, status, headers, config)
      //   {
      //       console.log("getDetails success");
      //       console.log(data[0]);
      //     $scope.hotelName = data[0].hotel.name;
      //     $scope.hotelId = data[0].hotel.id;
          
      //   })
      //   .error(function (data, status, headers, config)
      //   {
      //     console.log("getDetails error");
      //   });
    };


    $scope.addDetails = function (param) {
      console.log("addDetails 1");
      var url = "/v1/vendor/info/";
      url = url + param;
      var postData={
        name:$scope.name, 
        username: param, 
        id:$scope.candidateId,
        phone:$scope.phone,
        constituency:$scope.constituency, 
        party:$scope.party,
        email2:$scope.email, 
        logo:""

       };

      $http.post(url,postData)
        .success(function (data, status, headers, config)
        {
            console.log("addDetails success");
            alert("addDetails success");

        })
        .error(function (data, status, headers, config)
        {
          console.log("addDetails error");
           alert("addDetails error");
        });
    };

//////


// from an input element
// var filesToUpload = input.files;
// var file = filesToUpload[0];

// var img = document.createElement("img");
// var reader = new FileReader();  
// reader.onload = function(e) {
//   img.src = e.target.result
// }
// reader.readAsDataURL(file);

// var ctx = canvas.getContext("2d");
// ctx.drawImage(img, 0, 0);

// var MAX_WIDTH = 800;
// var MAX_HEIGHT = 600;
// var width = img.width;
// var height = img.height;

// if (width > height) {
//   if (width > MAX_WIDTH) {
//     height *= MAX_WIDTH / width;
//     width = MAX_WIDTH;
//   }
// } else {
//   if (height > MAX_HEIGHT) {
//     width *= MAX_HEIGHT / height;
//     height = MAX_HEIGHT;
//   }
// }
// canvas.width = width;
// canvas.height = height;
// var ctx = canvas.getContext("2d");
// ctx.drawImage(img, 0, 0, width, height);

// var dataurl = canvas.toDataURL("image/png");


/////
    $scope.addLogo = function (param,files) {
      console.log("addLogo");
      $scope.files = files;
      $scope.filePresent =  true;

      var fd = new FormData();
      console.log(files[0]);

      //Take the first selected file
      fd.append("file", files[0]);

      var url4 = "/v1/profile/logo/";
      url4 = url4 + param;
      console.log(param);

    };

    $scope.addComment= function (param) {
      console.log("addComment 1");
      var url = "/v1/comment/info/";
      

      var fd = new FormData();
     // console.log( $scope.files[0]);

      var postData={
        heading:$scope.heading,
        description:$scope.description,
        feedvideo:$scope.feedvideo
      };
     if($scope.files)
     {
      for(var i = 0; i <$scope.files.length ; i++)
      {
        fd.append("file",  $scope.files[i]);
      }
      console.log($scope.files);
    }
     else
     {
      fd.append("file",  null);
      }
        fd.append("data", JSON.stringify(postData));
      url = url + param;
    $http.post(url,fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined , 'enctype': 'multipart/form-data' },
        transformRequest: angular.identity
      }).success(function (data, status, headers, config)
        {
            console.log("addComment success");
            alert("addComment success");

        })
        .error(function (data, status, headers, config)
        {
          console.log("addComment error");
           alert("addComment error");
        });
    };



    $scope.addScrollImages= function (param) {
      console.log("addScrollImages 1");
      var url = "/v1/scrollimages/";
      

      var fd = new FormData();
     // console.log( $scope.files[0]);

     if($scope.files)
     {
      for(var i = 0; i <$scope.files.length ; i++)
      {
        fd.append("file",  $scope.files[i]);
      }
      console.log($scope.files);
    }
     else
     {
      fd.append("file",  null);
      }
       
      url = url + param;
    $http.post(url,fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined , 'enctype': 'multipart/form-data' },
        transformRequest: angular.identity
      }).success(function (data, status, headers, config)
        {
            console.log("addScrollImages success");
            alert("addScrollImages success");

        })
        .error(function (data, status, headers, config)
        {
          console.log("addScrollImages error");
           alert("addScrollImages error");
        });
    };


    $scope.getinbox = function (param) {
      console.log("getSuggestions");
      var url2 = "/v1/candidate/suggestion/";
      url2 = url2 + param;
      $http.get(url2)
        .success(function (data, status, headers, config)
        {
          $scope.inboxlist = data;
          
        })
        .error(function (data, status, headers, config)
        {
          $scope.inboxlist = logResult("GET ERROR", data, status, headers, config);
        });
    };

    $scope.getPosts = function (param) {
      console.log("getPosts");
      var url2 = "/v1/feed/info/";
      url2 = url2 + param;
      $http.get(url2)
        .success(function (data, status, headers, config)
        {
          $scope.postlist = data;
          
        })
        .error(function (data, status, headers, config)
        {
          $scope.inboxlist = logResult("GET ERROR", data, status, headers, config);
        });
    };

    $scope.deletePost = function (param,post) {
      console.log("deletPosts");
      console.log(param);
      console.log(post);
      var url2 = "/v1/feed/info/";
      url2 = url2 + param + "/" + post;
      $http.delete(url2)
        .success(function (data, status, headers, config)
        {
           alert("deleted post");
        })
        .error(function (data, status, headers, config)
        {
          $scope.inboxlist = logResult("GET ERROR", data, status, headers, config);
        });
        $scope.getPosts(param);
    };

    $scope.getScrollimages = function (param) {
      console.log("getPosts");
      var url2 = "/v1/scrollimages/";
      url2 = url2 + param;
      $http.get(url2)
        .success(function (data, status, headers, config)
        {
          $scope.scrollimages = data;
          
        })
        .error(function (data, status, headers, config)
        {
          $scope.inboxlist = logResult("GET ERROR", data, status, headers, config);
        });
    };

    $scope.deleteScrollimages = function (param,imageid) {
      console.log("deleteScrollimages");
      console.log(param);
      console.log(imageid);
      var url2 = "/v1/scrollimages/";
      url2 = url2 + param + "/" + imageid;
      $http.delete(url2)
        .success(function (data, status, headers, config)
        {
           alert("deleted Scroll Image");
        })
        .error(function (data, status, headers, config)
        {
          $scope.inboxlist = logResult("GET ERROR", data, status, headers, config);
        });
        $scope.getScrollimages(param);
    };
  });



