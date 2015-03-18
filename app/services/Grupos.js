/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.service('GruposResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/grupos', {}, {
		query: { method: 'GET', isArray: true },
		create: { method: 'POST' }
	});

}]);

app.service('GrupoResource', 
	['$resource', function ($resource) {

    return $resource(apiUrl + '/grupos/:id', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
        delete: { method: 'DELETE', params: { id: '@id' } }
    });
}]);


app.factory('IGrupoFactory', ['$rootScope', '$log', function($rootScope, $log) {
	var IGrupoFactory = this;

	IGrupoFactory.grupo = {};
	IGrupoFactory.grupos = [];

	IGrupoFactory.selectItem = function (grupo) {
		this.grupo = grupo;
		$rootScope.$broadcast('handlerSelectGrupo');
	}

	IGrupoFactory.selectItems = function (grupos) {
		this.grupos = grupos;
		$rootScope.$broadcast('handlerSelectGrupos');
	}

	IGrupoFactory.pushItem = function (grupo) {
		var exist = false;

		angular.forEach(this.grupos, function (item) {
			if(item.id == grupo.id) { exist = true; }
		}, this);

		if(!exist) {
			this.grupos.push(grupo);
			$rootScope.$broadcast('handlerPushGrupo');
		}
	}

	return IGrupoFactory;
}]);