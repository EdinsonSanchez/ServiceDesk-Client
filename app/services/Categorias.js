/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

// Categoria de las tipificaciones Resource.
app.service('CategoriasResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/categorias', {}, {
		query: { method: 'GET', isArray: true }
	});

}]);
