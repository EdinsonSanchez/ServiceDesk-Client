/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.service('UbicacionesResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/ubicacions', {}, {
		query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
	});

}]);

app.service('UbicacionResource',
	['$resource', function ($resource) {

    return $resource(apiUrl + '/ubicacions/:id', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
        delete: { method: 'DELETE', params: { id: '@id' } }
    });
}]);
