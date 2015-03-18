/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.factory('CargosFactory', ['$http', function ($http) {
	
	var CargosFactory = {};

	CargosFactory.getCargos = function() {
		return $http.get(apiUrl + '/cargos');
	};

	return CargosFactory;
}]);


app.service('CargosResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/cargos', {}, {
		create: { method: 'POST' }
	});

}]);

app.service('CargoResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/cargos/:id', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
        delete: { method: 'DELETE', params: { id: '@id' } }
    });

}]);