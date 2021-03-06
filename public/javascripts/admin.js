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
      };
     if($scope.files)
     {
      fd.append("file",  $scope.files[0]);
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
  });



