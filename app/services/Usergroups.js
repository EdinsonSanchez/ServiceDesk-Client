/**
 * @package     ServiceDesk
 * @subpackage  services
 *
 * @author      Edinson J. Sanchez
 * @copyright   Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.service('UsergroupsResource', ['$resource', function($resource){
	return $resource(apiUrl + '/usergroups', {}, {
      	query: { method: 'GET', isArray: true },
      	create: { method: 'POST' }
	});
}]);

app.service('UsergroupResource', ['$resource', function($resource){
	return $resource(apiUrl + '/usergroups/:id', {}, {
      	show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
        delete: { method: 'DELETE', params: { id: '@id' } }
	});
}]);