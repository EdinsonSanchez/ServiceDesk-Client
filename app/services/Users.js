/**
 * @package     ServiceDesk
 * @subpackage  services
 *
 * @author      Edinson J. Sanchez
 * @copyright   Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.service('UsersResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/users', {}, {
      create: { method: 'POST' }
	});

}]);

app.service('UserResource', 
  ['$resource', function ($resource) {

    return $resource(apiUrl + '/users/:id', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
    });
}]);


app.service('AuthService', ['$http', '$log', 'Session', function ($http, $log, Session) {

  	var authService = {};
 
  	authService.login = function (credentials) {
        return $http.post(apiUrl + '/login/auth', credentials)
            .then(function (res) {
                Session.create(res.data);
	        	    return res.data;
	      	  });
  	};
	 
  	authService.logout = function () {
  		  $log.info("destroy session");
  		  Session.destroy();
  	}

  	authService.isAuthenticated = function () {
      // $log.info(Session.getSession() !== undefined);
  		  return Session.getSession() !== undefined;
  	};

  	authService.getUser = function () {
        return Session.getSession();
  	};
 
    authService.isAuthorized = function (authorizedRoles) {

        // $log.info(authorizedRoles);

  		  if (!angular.isArray(authorizedRoles)) {
        		authorizedRoles = [authorizedRoles];
      	}

        if(authService.isAuthenticated())
        {
            var authorized = [];
            angular.forEach(Session.userRoles, function(rol) {

                if(authorizedRoles.indexOf(rol) !== -1)
                {
                    authorized.push(true);
                }
            }, this);

            if(authorized.indexOf(true) !== -1)
            {
                return true;
            }
            // if(authorizedRoles.indexOf(Session.userRoles) !== -1)
            // {
            //     return true;
            // }
        }

        return false;
  	};


  	return authService;
}]);

app.service('Session', function ($cookieStore) {
    this.userRoles = [];

    this.create = function (sessionInfo) {
      $cookieStore.put('MSSID', sessionInfo);
    };
    this.getSession = function () {

        // console.log($cookieStore.get('MSSID'));
        return $cookieStore.get('MSSID');
    };

    this.destroy = function () {
      $cookieStore.remove('MSSID');
    };


    angular.forEach(this.getSession() !== undefined ? this.getSession().usergroups : [], function(rol) {
        this.userRoles.push(rol.alias);
    }, this);

    // this.userRole = this.getSession() !== undefined ? this.getSession().usergroups[0].alias : null;

    return this;
});