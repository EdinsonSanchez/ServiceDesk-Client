/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.service('ClasificacionicsResource', ['$resource', function ($resource) {

	return $resource(apiUrl + '/clasificacionics', {}, {
		query: { method: 'GET', isArray: true },
	});

}]);