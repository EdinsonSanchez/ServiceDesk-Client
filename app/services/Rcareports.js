/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';


app.service('RcareportsResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/rcareports', {}, {
		query: { method: 'GET', isArray: true },
		create: { method: 'POST' }
	});

}]);

app.service('RcareportResource', ['$resource', function($resource) {
    
    return $resource(apiUrl + '/rcareports/:id', {}, {
        show: { method: 'GET' }
    });
}]);