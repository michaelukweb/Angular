'use strict';


angular.module('urbanApp')
  .controller('employeeReportCtrl', function($scope, $http, $cookies, $state) {
    var s = $scope;



    if ($cookies.get('fab_customer')) {
      s.fab_customer = $cookies.get('fab_customer');
    } else {
      $state.go('user.signin');
    }

    getEmployeeReports();

    function getEmployeeReports() {

      $http.get('/api/employeereport/').success(function(json) {

        s.data = json[0];

        console.log(json[0]);


      });
    }

    s.sort = function(Keyname) {

      s.sortKey = Keyname;
      s.reverse = !s.reverse;

    }



  })
