/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */
 
'use strict';

app.service('SucursalesResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/sucursales', {}, {
		query: { method: 'GET', isArray: true },
	});

}]);
