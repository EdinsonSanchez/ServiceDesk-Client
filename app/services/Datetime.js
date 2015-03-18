/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.factory('DatetimeResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/datetime', {}, {
		query: { method: 'GET' },
	});

}]);