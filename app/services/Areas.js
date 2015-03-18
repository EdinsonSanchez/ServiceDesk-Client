/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.service('AreasResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/areas', {}, {
		query: { method: 'GET', isArray: true },
		create: { method: 'POST' }
	});

}]);

app.service('AreaResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/areas/:id', {}, {
		show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
        delete: { method: 'DELETE', params: { id: '@id' } }
	});

}]);