/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.service('IncClasesResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/incclases', {}, {
		query: { method: 'GET', isArray: true },
		create: { method: 'POST' }
	});

}]);

app.service('IncClaseResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/incclases/:id', {}, {
		show: { method: 'GET' },
		update: { method: 'PUT', params: { id: '@id' } },
		delete: { method: 'DELETE', params: { id: '@id' } }
	});

}]);
