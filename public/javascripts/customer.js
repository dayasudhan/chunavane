  var customerApp = angular.module("mainModule", ['ui.router']);
var config = {
    headers: {
        'securekey': 'RN4CDXkqltLF%2FWloegKujIhiaSWBrgCzQXqI9cyWpT0',
        'client': 'pickcock',
        'version': '1'
    }
};
customerApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: '../../views/customer_home.ejs',
            controller: 'mainController'
        })
        .state('find', {
            url: '/find',
            templateUrl: '../../views/customer_find.ejs',
            controller: 'mainController'
        })
        // nested list with custom controller
        .state('menu', {
            url: '/menu',
            templateUrl: '../../views/customer_menu.ejs',
            controller: 'mainController'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: '../../views/customer_profile.ejs',
            controller: 'mainController'
        })
        //        .state('about', {
        //            url: '/about',
        //            templateUrl: '../../views/customer_about.ejs',
        //            controller: 'mainController'
        //        })
        //        .state('contact', {
        //            url: '/contact',
        //            templateUrl: '../../views/customer_contact.ejs',
        //            controller: 'mainController'
        //        })
        //        .state('terms', {
        //            url: '/terms',
        //            templateUrl: '../../views/customer_terms.ejs',
        //            controller: 'mainController'
        //        })
        //        .state('privacy', {
        //            url: '/privacy',
        //            templateUrl: '../../views/customer_privacypolicy.ejs',
        //            controller: 'mainController'
        //        })
        //        .state('faq', {
        //            url: '/faq',
        //            templateUrl: '../../views/customer_faq.ejs',
        //            controller: 'mainController'
        //        })
});
customerApp.controller('mainController', function ($rootScope, $scope, $http, jsonFilter, $window) {


    $scope.login_customer = function () {
        console.log("login_customer");
        console.log($scope.login_phone);
        console.log($scope.login_password);
        var login_body = new Object();
        login_body.email = $scope.login_phone;
        login_body.password = $scope.login_password;
        login_body.role = "customer";
        console.log(login_body);
        var url = "/login";

        if ($scope.login_phone == "" || $scope.login_phone == null || hasWhiteSpace($scope.login_phone) == true) {
            $window.alert("Phone Number Empty");
        } else if (!$scope.phonenumber($scope.login_phone)) {
            $window.alert("Invalid Phone Number");
        } else if ($scope.login_password == "" || $scope.login_password == null || hasWhiteSpace($scope.login_password) == true) {
            $window.alert("Passwords should not contain Blank Spaces.");
        } else {

            $http.post(url, login_body, config)
                .success(function (data, status, headers) {
                    console.log("Success in login post 1");
                    console.log(data);
                    console.log("Success in login post 2");
                    if (data == 0) {
                        $scope.isLoggedIn = false;
                        $window.alert("Invalid Login Details");
                    } else {
                        $scope.isLoggedIn = true;
                        $('#myModal').modal('hide');
                        console.log($scope.isLoggedIn);
                    }
                    
                    $scope.profile = data[0];
                    console.log($scope.profile);
                    console.log($scope.profile.name);
                    $scope.phone = $scope.profile.phone;
                    $scope.user = $scope.profile.name;

                    //           if(data == 0)
                    //               {
                    //                    $window.alert("Invalid username and password ");
                    //               }


                })
                .error(function (data, status, headers) {
                    console.log("ERROR in login");
                });
        }
    };


    $scope.signup_customer = function () {
        console.log("signup_customer");
        console.log($scope.signup_phone);
        console.log($scope.signup_password);
        var signup_body = new Object();
        signup_body.email2 = $scope.signup_email;
        signup_body.password = $scope.signup_password1;
        signup_body.name = $scope.signup_name;
        signup_body.email = $scope.signup_phone;
        signup_body.password2 = $scope.signup_password2;
        signup_body.role = "customer";
        console.log(signup_body);
        var url = "/signup";

        if ($scope.signup_name == "" || $scope.signup_name == null) {
            $window.alert("Name Empty");
        } else if ($scope.signup_phone == "" || $scope.signup_phone == null || hasWhiteSpace($scope.signup_phone) == true) {
            $window.alert("Phone Number Empty");
        } else if (!$scope.phonenumber($scope.signup_phone)) {
            $window.alert("Invalid Phone Number");
        } else if ($scope.signup_email == "" || $scope.signup_email == null || hasWhiteSpace($scope.signup_email) == true) {
            $window.alert("Email Empty");
        } else if (!$scope.emailid($scope.signup_email)) {
            $window.alert("Invalid E-Mail");
        } else if ($scope.signup_password1 == "" || $scope.signup_password1 == null || hasWhiteSpace($scope.signup_password1) == true) {
            $window.alert("Password 1 Empty");
        } else if ($scope.signup_password2 == "" || $scope.signup_password2 == null || hasWhiteSpace($scope.signup_password2) == true) {
            $window.alert("Password 2 Empty");
        } else if($scope.signup_password1 != $scope.signup_password2)
        {
          $window.alert("Password Mismatch");
        }
        else {
            $http.post(url, signup_body, config)
                .success(function (data, status, headers) {
                    console.log("Success in sign up post");

                    console.log(data);
                    if (data == 0) {
                        $scope.isLoggedIn = false;
                        $window.alert("Enter Proper Details or User already Exissts");
                    } else {
                      $('#signupModal').modal('hide');
                        $scope.isLoggedIn = true;
                        $scope.profile = data;
                        $scope.phone = $scope.profile.phone;
                        $scope.user = $scope.profile.name;
                    }


                    console.log($scope.isLoggedIn);

                })
                .error(function (data, status, headers) {
                    console.log("ERROR in login");
                });
        }
    };

    $scope.forgot_customer = function () {
        console.log("forgot_customer");
        console.log($scope.forgot_phone);

        var signup_body = new Object();

        signup_body.phoneNumber = $scope.forgot_phone;
        signup_body.role = "customer";
        console.log(signup_body);
        var url = "/v1/vendor/otp/register";

        if ($scope.forgot_phone == "" || $scope.forgot_phone == null || hasWhiteSpace($scope.forgot_phone) == true) {
            $window.alert("Phone Number Empty");
        } else if (!$scope.phonenumber($scope.forgot_phone)) {
            $window.alert("Invalid Phone Number");
        } else {
            $http.post(url, signup_body, config)
                .success(function (data, status, headers) {
                    console.log("Success in forgot phonenumber post");

                    console.log(data);

                    if (data == 'Success') {
                        $scope.isOktocontinue = true;
                        $scope.phone = $scope.forgot_phone;
                        console.log("success forgot_customer");
                        
                        $('#forgotModal').modal('hide');
                        $('#otpModal').modal('show');
                    } else {
                        console.log("else 1");
                        $scope.isOktocontinue = false;
                        $window.alert("Invalid Phone Number");
                    }

                })
                .error(function (data, status, headers) {
                    console.log("ERROR in forgot passowrd");
                });
        }
    };


    $scope.customer_otp_verify = function () {
        console.log("customer_otp_verify");
        console.log($scope.forgot_phone);
        console.log($scope.otp_text);
        var signup_body = new Object();

        signup_body.phoneNumber = $scope.forgot_phone;
        signup_body.otpText = $scope.otp_text;
        signup_body.role = "customer";
        console.log(signup_body);
        var url = "/v1/vendor/otp/confirm_for_web";

        if ($scope.otp_text == "" || $scope.otp_text == null || hasWhiteSpace($scope.otp_text) == true) {
            $window.alert("OTP Empty");
        } 
        else {
            $http.post(url, signup_body, config)
                .success(function (data, status, headers) {
                    console.log("Success in otp verify post");

                    console.log(data);
                    if (data == 'Success') {
                        $scope.isOktocontinue = true;
                        $scope.phone = $scope.forgot_phone;
                        console.log("success customer_otp_verify");
                        
                           $('#otpModal').modal('hide');
                        $('#newpwdModal').modal('show');

                    } else {
                        $scope.isOktocontinue = false;
                        console.log("error customer_otp_verify");
                        $window.alert("Invalid OTP");
                    }

                })
                .error(function (data, status, headers) {
                    console.log("ERROR in login");
                });
        }
    };

    $scope.reset_password = function () {
        console.log("reset_password");
        console.log($scope.forgot_phone);
        console.log($scope.forgot_password);
        var signup_body = new Object();
        signup_body.password = $scope.forgot_password1;
        signup_body.email = $scope.forgot_phone;
        signup_body.password2 = $scope.forgot_password2;
        signup_body.role = "customer";
        console.log(signup_body);
        var url = "/reset";
        if ($scope.forgot_password1 == "" || $scope.forgot_password1 == null || hasWhiteSpace($scope.forgot_password1) == true) {
            $window.alert("Password Empty");
        } else if ($scope.forgot_password2 == "" || $scope.forgot_password2 == null || hasWhiteSpace($scope.forgot_password2) == true) {
            $window.alert("Confirm Password Empty");
        }else if($scope.forgot_password1 != $scope.forgot_password2)
        {
          $window.alert("Password Mismatch");
        } 
        else {
            $http.post(url, signup_body)
                .success(function (data, status, headers) {
                    console.log("Success in sign up post");


                    console.log(data[0]);
                    if (data == 0 || data == 'ERROR') {
                        $scope.isLoggedIn = false;
                        $window.alert("Password Reset Failed");
                    } else {
                    
                      $('#newpwdModal').modal('hide');
                        $scope.isLoggedIn = true;
                        $scope.profile = data[0];
                        $scope.phone = $scope.profile.phone;
                        $scope.user = $scope.profile.name;
                        $window.alert("Password Reset Success");
                        console.log($scope.phone);
                        console.log($scope.user);

                    }


                    console.log($scope.isLoggedIn);

                })
                .error(function (data, status, headers) {
                    console.log("ERROR in login");
                });
        }
    };

    $scope.findRestaurantsByNearBy = function () {
        //  $scope.getCurrentAddress()
        console.log("findRestaurantsByNearBy");
        //var url = "/v1/vendor/city?";
        var url = "/v1/vendor/delieveryareas?";
        console.log($scope.areaName);
        console.log($scope.city);
        url = url + "city=" + $scope.city + "&areaName=" + $scope.areaName;
        $http.get(url, config)
            .success(function (data, status, headers, config) {

                $scope.hotellist = data;
            })
            .error(function (data, status, headers, config) {
                $scope.simpleGetCallResult = logResult("GET ERROR", data, status, headers, config);
            });
    };

    $scope.findRestaurants = function () {
        console.log("findRestaurants");
        //  var url = "/v1/vendor/city?";
        var url = "/v1/vendor/delieveryareas?";
        var search_areaname = $scope.subAreaCoverage[$scope.selectedAreaIndex];
        console.log($scope.subAreaCoverage[$scope.selectedAreaIndex]);
        url = url + "city=" + $scope.cityCoverage.citys[$scope.selectedCity] + "&areaName=" + search_areaname;
        $http.get(url, config)
            .success(function (data, status, headers, config) {

                $scope.hotellist = data;
            })
            .error(function (data, status, headers, config) {
                $scope.simpleGetCalResult = logResult("GET ERROR", data, status, headers, config);
            });
    };
    $scope.getOrderStatus = function () {
        console.log("getOrderStatus");
        console.log($scope.orderId);
        console.log(hasWhiteSpace($scope.orderId));
        if ($scope.orderId == "" || $scope.orderId == null || hasWhiteSpace($scope.orderId) == true) {
            $window.alert("OrderId Empty");
        } else {
            var url = "/v1/vendor/order_by_id/";
            url = url + $scope.orderId;
            $http.get(url, config)
                .success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.OrderStatus = data;
                    $scope.order_status = "delivered";
                    console.log($scope.OrderStatus[0].tracker);
                    $('#myModal1').modal('show');
                })
                .error(function (data, status, headers, config) {
                    $scope.simpleGetCallResult = logResult("GET ERROR", data, status, headers, config);
                });
        }
    };
    $scope.postOrder = function (ordarr) {
        console.log("postOrder");
        console.log(ordarr);
        var url = "/v1/vendor/order";
        $http.post(url, ordarr)
            .success(function (data, status, headers) {
                console.log("Success in postorder");

                console.log(data.id)
                $scope.orderId = data.id;
            })
            .error(function (data, status, headers) {
                console.log("ERROR in postorder");
            });
    };


    $scope.currentHotel = function (index) {
        console.log("currentHotel");
        // var myHidden = document.getElementById("<%= user.local.email>");
        //  console.log(myHidden);
        console.log(index);

        console.log($scope.hotellist[index]);
        $rootScope.hotel = $scope.hotellist[index];
        angular.forEach($scope.hotel.menu, function (item) {
            item.qty = 0;
        })

        // console.log($scope.user);
        //  $scope.getCustsomerDetails();

        // $window.location.href = '/menu'; 
    };

    $scope.total = function () {
        var total = 0;
        angular.forEach($scope.hotel.menu, function (item) {
            total += item.price * item.qty;
        })
        return total;
    };
    $scope.grandtotal = function () {
        var total = 0;
        angular.forEach($scope.hotel.menu, function (item) {
            total += item.price * item.qty;
        })
        var grandtotal = total + $scope.hotel.deliverCharge;
        return grandtotal;
    };
    $scope.confirmOrder = function () {
        if ($scope.isLoggedIn === true) {
            console.log("loggedin proceed to order");
        } else {

            $('#loginModal').modal('show');
            console.log("loggedin proceed to not order");
        }
        if ($scope.isOrderPresent) {
            $scope.postOrder($scope.orderSummary);
            //         $scope.postAddress($scope.orderSummary.address);
        }
    }


    $scope.fnChangeAssetType = function (val) {
        $scope.addressLine1 = val.addressLine1;
        $scope.addressLine2 = val.addressLine2;
        $scope.street = val.street;
        $scope.landmark = val.LandMark;
        $scope.areaName = val.areaName;
        $scope.city = val.city;
        $scope.zip = val.zip;
        $scope.latitude = val.latitude;
        $scope.longitude = val.longitude;
    }
    $scope.phonenumber = function (inputtxt) {
        console.log("phonenumber 1 ", inputtxt);
        //console.log($scope.selected[address.label]);
        var phoneno = /(?:\s+|)((0|(?:(\+|)91))(?:\s|-)*(?:(?:\d(?:\s|-)*\d{9})|(?:\d{2}(?:\s|-)*\d{8})|(?:\d{3}(?:\s|-)*\d{7}))|\d{10})(?:\s+|)/;
        if (phoneno.test(inputtxt)) {
            return true;
        } else {

            return false;
        }
    }
    
    $scope.emailid = function (inputtxt) {
        console.log("email 1 ", inputtxt);
        //console.log($scope.selected[address.label]);
        var mailid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
        if (mailid.test(inputtxt)) {
            return true;
        } else {

            return false;
        }
    }

    $scope.order = function () {

        console.log("order function 1");
        console.log($scope.user);
        console.log("order function 2");
        var ordMenu = [];
        $scope.isOrderPresent = false;
        var total_price = 0;
        $scope.showModal = false;
        angular.forEach($scope.hotel.menu, function (item) {
            var obj = new Object();
            if (item.qty > 0) {
                obj.name = item.name;
                obj.no_of_order = item.qty;
                obj.price = item.qty * item.price;
                total_price += obj.price;
                ordMenu.push(obj);
                $scope.isOrderPresent = true;
            }
        });
        console.log("order function 34523");
        if (!$scope.phonenumber($scope.phone)) {
            console.log("phonenumber 2");
            $window.alert("Invalid Phone Number");
        } else if ($scope.isOrderPresent == false) {
            console.log("order function 345");

            $window.alert("no items selected");

            $scope.showModal = false;
        } else if (total_price < $scope.hotel.minimumOrder) {
            var minimum_order = "Minimum Order for this Hotel is Rs.";
            minimum_order = minimum_order + $scope.hotel.minimumOrder + " Kindly add more items";
            $window.alert(minimum_order);
            $scope.showModal = false;
            $scope.isOrderPresent == false;
        } else if ($scope.isLoggedIn === false) {
            console.log("not loggedin ");

            $('#loginModal').modal('show');

        } else {
            console.log("order function else");
            console.log($scope.isLoggedIn);
            $('#myModal3').modal()
        }
        var totalCost = $scope.hotel.deliverCharge + total_price;
        var ordarr = {
            "hotel": $scope.hotel.hotel,
            "menu": ordMenu,
            "totalCost": totalCost,
            "bill_value": total_price,
            "deliverCharge": $scope.hotel.deliverCharge,
            "customer": {
                "name": $scope.user,
                "email": "",
                "phone": $scope.phone,
                "address": {
                    "addressLine1": $scope.addressLine1,
                    "addressLine2": $scope.addressLine2,
                    "street": $scope.street,
                    "LandMark": $scope.landmark,
                    "areaName": $scope.areaName,
                    "city": $scope.city,
                    "zip": $scope.zip,
                    "latitude": $scope.latitude,
                    "longitude": $scope.longitude
                }
            }
        };
        $scope.orderSummary = ordarr;
        $scope.total_price = total_price;


    };

    $scope.getCustsomerDetails = function () {
        console.log("getCustsomerDetails");
        var url = "/v1/customer";
        $http.get(url)
            .success(function (data, status, headers, config) {
                console.log(data[0].phone);
                $scope.phone = data[0].phone;
                $scope.user = data[0].id;
                $scope.flat_no = data[0].address.addressLine1;
                $scope.address = data[0].address.addressLine2;
                $scope.landmark = data[0].address.LandMark;
                $scope.areaName = data[0].address.areaName;
                $scope.city = data[0].address.city;
            })
            .error(function (data, status, headers, config) {
                $scope.simpleGetCallResult = logResult("GET ERROR", data, status, headers, config);
            });
    };

    $scope.postCustsomerDetails = function (param) {
        console.log("postCustsomerDetails");
        console.log(ordarr);
        var url = "/v1/customer/";
        url = url + param;
        $http.post(url, ordarr)
            .success(function (data, status, headers) {
                console.log("Success in postorder")
            })
            .error(function (data, status, headers) {
                console.log("ERROR in postorder");
            });
    };
    $scope.updateCitySelected = function () {};
    $scope.getCityCoverage = function () {
        console.log("getCityCoverage");
        initprofile2();
        var url = "/v1/admin/coverageArea";
        $http.get(url, config)
            .success(function (data, status, headers, config) {
                console.log("response");
                console.log(data);

                var cityCoverage = [];
                var objCity = [];
                angular.forEach(data, function (city) {
                    var obj = new Object();
                    var obj2 = new Object();
                    obj2 = city.cityName;
                    var subAreaCoverage = [];
                    angular.forEach(city.subAreas, function (area) {
                        //  var obj2 = new Object();
                        // obj2.subAreaName = area.name;
                        subAreaCoverage.push(area.name);
                    });
                    obj.subAreas = subAreaCoverage;
                    $scope.subAreaCoverage = subAreaCoverage
                    cityCoverage.push(obj);
                    objCity.push(obj2)
                });
                console.log("sngulr");
                cityCoverage.citys = objCity;
                $scope.cityCoverage = cityCoverage;
                $scope.selectedCity = 0;
                $scope.selectedAreaIndex = 0;

                console.log($scope.cityCoverage);

            })
            .error(function (data, status, headers, config) {
                $scope.simpleGetCallResult = logResult("GET ERROR", data, status, headers, config);
            });
    };

    $scope.getCurrentAddress = function () {
        console.log("getCurrentAddress");
        var url = "/v1/customer";

        if (navigator.geolocation) {
            console.log("getCurrentAddress 2");
            navigator.geolocation.getCurrentPosition(showPosition);
            console.log("getCurrentAddress 4");
        }

    };
    $scope.addAddress = function (param) {
        console.log("addAddress");


        var url4 = "/v1/customer/address/";
        url4 = url4 + $scope.profile.phone;
        console.log(url4);
        if ($scope.label == "" || $scope.label == null || hasWhiteSpace($scope.label) == true) {
            $window.alert("Label Empty");
        } else if ($scope.addressLine1 == "" || $scope.addressLine1 == null) {
            $window.alert("Address Line 1 Empty");
        } else if ($scope.addressLine2 == "" || $scope.addressLine2 == null) {
            $window.alert("Address Line 2 Empty");
        } else if ($scope.LandMark == "" || $scope.LandMark == null) {
            $window.alert("Landmark Empty");
        } else if ($scope.city == "" || $scope.city == null) {
            $window.alert("City Empty");
        } else if ($scope.zip == "" || $scope.zip == null) {
            $window.alert("Zip Empty");
        } else {
            var postData = {
                label: $scope.label,
                address: {
                    addressLine1: $scope.addressLine1,
                    addressLine2: $scope.addressLine2,
                    street: $scope.street,
                    LandMark: $scope.LandMark,
                    areaname: $scope.areaname,
                    city: $scope.city,
                    zip: $scope.zip,
                    latitude: $scope.latitude,
                    longitude: $scope.longitude
                }
            }
            $http.post(url4, postData)
                .success(function (data, status, headers, config) {
                    console.log("success add");
                    console.log(data);
                    initprofile();
                })
                .error(function (data, status, headers, config) {
                    console.log("errod on add");
                    console.log(status);
                    console.log(data);
                });
        }
    };

    $scope.deleteAddress = function (address) {
        console.log("deleteAddress");


        var url4 = "/v1/customer/address/";
        console.log(address);

        url4 = url4 + $scope.profile.phone + "/" + address.label;
        console.log(url4);

        $http.delete(url4)
            .success(function (data, status, headers, config) {
                console.log("success delete");
                console.log(data);
                initprofile();
            })
            .error(function (data, status, headers, config) {
                console.log("errod on delete");
                console.log(status);
                console.log(data);
            });
    };

    function initprofile2() {
        console.log("initprofile2");
        var url = "/v1/customer/";
        //url = url + $scope.profile.phone;
        $http.get(url).success(function (data, status, headers) {
                console.log("Success in get");
                // console.log(data);

                if (data == 0) {
                    $scope.isLoggedIn = false;

                } else {
                    $scope.isLoggedIn = true;
                }
                console.log($scope.isLoggedIn);
                $scope.profile = data[0];
                console.log($scope.profile);
                console.log($scope.profile.name);
                $scope.phone = $scope.profile.phone;
                $scope.user = $scope.profile.name;
                $scope.isLoggedIn = true;
            })
            .error(function (data, status, headers) {
                console.log("ERROR in init get");
            });
    }

    $scope.editAddress = function () {
        console.log("editAddress");


        var url4 = "/v1/customer/address/";
        //  console.log(address);

        url4 = url4 + $scope.profile.phone + "/" + $scope.editaddress.label;
        console.log(url4);

        var postData = {
            label: $scope.label,
            address: {
                addressLine1: $scope.addressLine1,
                addressLine2: $scope.addressLine2,
                street: $scope.street,
                LandMark: $scope.LandMark,
                areaname: $scope.areaName,
                city: $scope.city,
                zip: $scope.zip,
                latitude: $scope.latitude,
                longitude: $scope.longitude
            }
        }
        console.log(postData);
        $http.patch(url4, postData)
            .success(function (data, status, headers, config) {
                console.log("success edit");
                console.log(data);
                initprofile();
            })
            .error(function (data, status, headers, config) {
                console.log("errod on edit");
                console.log(status);
                console.log(data);
            });
    };

    $scope.editAddressFirst = function (address) {
        console.log("editAddressFirst");
        $scope.editaddress = address;
        console.log($scope.editaddress);
        $scope.label = address.label;
        $scope.addressLine1 = address.addressLine1;
        $scope.addressLine2 = address.addressLine2;
        $scope.street = address.street;
        $scope.LandMark = address.LandMark;
        $scope.areaName = address.areaName;
        $scope.city = address.city;
        $scope.zip = address.zip;
        $scope.latitude = address.latitude;
        $scope.longitude = address.longitude;
    };


    function initprofile() {
        var url = "/v1/customer/phone/";
        url = url + $scope.profile.phone;
        $http.get(url).success(function (data, status, headers) {
                console.log("Success in get");
                console.log(data);


                $scope.profile = data[0];
                console.log($scope.profile);
                console.log($scope.profile.name);
            })
            .error(function (data, status, headers) {
                console.log("ERROR in init get");
            });
    }


    function showPosition(position) {
        console.log("getCurrentAddress 3");
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
        url = url + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false';
        //url = url + 12.999390499999999 + ',' + 77.55813169999999 + '&sensor=false';
        $http.get(url)
            .success(function (data, status, headers, config) {
                console.log("getCurrentAddress 4  ");
                console.log(data);
                console.log("getCurrentAddress 5  ");
                console.log(data.results[0].address_components[0].long_name);
                console.log(data.results[0].address_components[1].long_name);
                console.log(data.results[0].address_components[2].long_name);
                console.log(data.results[0].address_components[3].long_name);
                console.log(data.results[0].address_components[4].long_name);
                console.log(data.results[0].formatted_address);
                $scope.address = data.results[0].address_components[0].long_name + ',' + data.results[0].address_components[1].long_name;
                $scope.areaName = data.results[0].address_components[2].long_name;
                $scope.landmark = data.results[0].address_components[3].long_name;
                $scope.city = data.results[0].address_components[4].long_name;
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                $scope.zip = data.results[0].address_components[8].long_name;
            })
            .error(function (data, status, headers, config) {

                $scope.simpleGetCallResult = logResult("GET ERROR", data, status, headers, config);
            });
    }

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }
    //
    ////    function isPhonenumberValid(inputtxt) {
    ////        // var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;  
    ////        var phoneno = /^ \+?\d[\d -]{8,12}\d/;
    ////        var re = new RegExp("^" + phoneno);
    ////        console.log(inputtxt);
    ////        if (inputtxt.match(re)) {
    ////            return true;
    ////        } else {
    ////
    ////            return false;
    ////        }
    ////    }
    //
    //    function validatePhone(field) {
    //        if (field.match(/^\d{10}/)) {
    //            return true;
    //        }
    //        return false;
    //    }
});