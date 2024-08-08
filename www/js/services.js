angular.module('xTan.services',[])

.service('APICall', function( $q, $http ) {

  var self = this;
  self.ProcessHTTPRequest = function(requestObject) {
    var defer = $q.defer();

    $http(requestObject).then(function successCallback(response) {
          console.log("API Call Successful" + response);
          defer.resolve(response);
    },
    function errorCallback(response) {
        console.log("API Call Unsuccessful" + response);
        defer.reject(response);

    });

    return defer.promise;
  }
})



.service('LocalStorage', function( $cordovaPreferences ) {

  var self = this;

  self.Save = function(key, key_value) {
    var success = false;
    $cordovaPreferences.store( key , key_value , 'dic_user_info')
      .success(function(value) {
        console.log(key + " Save done? " + value + " | key value: " + key_value + " <-----");
        success = true;
      })
      .error(function(error) {
        console.log(key + " Save Error: " + error);
        success = false;
      })

    return success;
  }

  self.Fetch = function(key) {

    self.fetchValue = '';
    $cordovaPreferences.fetch(key, 'dic_user_info')
      .success(function(value) {
        if(value!=null) {

          self.fetchValue = value;
          console.log(key + " Fetch done " + value + " <-----");
          return self.fetchValue;
        }
      })
      .error(function(error) {
        console.log(key + "Fetch Error: " + error);
        self.fetchValue = '';
      })

    return self.fetchValue;
  }

  self.Remove = function(key) {

    var removed = false;
    $cordovaPreferences.remove( key , 'dic_user_info')
      .success(function(value) {
        console.log(key + " remove done? " + value  + " <-----");
        removed = true;
      })
      .error(function(error) {
        console.log(key + " Save Error: " + error);
        removed = false;
      })

    return removed;

  }

})
