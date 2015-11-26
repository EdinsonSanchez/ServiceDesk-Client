/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.factory('PersonasFactory', ['$http', function ($http) {

	var PersonasFactory = {};

	PersonasFactory.getPersonas = function () {
		return $http.get(sandboxUnport + '/personas');
	};

	PersonasFactory.getPersonasBySucursal = function (sucursalId) {
		return $http.get(sandboxUnport + '/personas?sucursalId=' + sucursalId);
	};

	PersonasFactory.getPersonalByGrupo = function (grupoId) {
		return $http.get(sandboxUnport + '/trabajadores?grupoId=' + grupoId);
		// retorna del servidor en este formato [object { object { object } }, object { object { object } }]
	};

	PersonasFactory.postPersona = function (persona) {
		return $http.post(sandboxUnport + '/personas', persona)
			.then(function (response) {
				return response.data;
			});
	};

	return PersonasFactory;
}]);


app.service('PersonaResource', ['$resource', function ($resource) {
	return $resource(apiUrl + '/personas/:id', {}, {
		show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
		delete: { method: 'DELETE', params: { id: '@id' } }
	});
}]);


// Interfaz Persona Factory utilizada para compartir una persona entre controladores
app.factory('IPersonaFactory', ['$rootScope', '$log', function ($rootScope, $log) {
    var IPersonaFactory = this;

    IPersonaFactory.persona = {};

    IPersonaFactory.selectItem = function (persona) {
        this.persona = persona;
        $rootScope.$broadcast('handlerSelectPersona');
    }

    return IPersonaFactory;
}]);
