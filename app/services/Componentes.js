/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.factory('ComponentesResource', ['$resource', function ($resource) {
	return $resource(apiUrl + '/componentes', {}, {
		query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
	});
}]);

app.service('ComponenteResource', 
	['$resource', function ($resource) {

    return $resource(apiUrl + '/componentes/:id', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
        delete: { method: 'DELETE', params: { id: '@id' } }
    });
}]);

// Interface pass to data controller to controller
app.factory('ComponenteFactory',
	['$rootScope', '$log',
	function ($rootScope, $log) {

	var ComponenteFactory = this;

	ComponenteFactory.componente = {};
	ComponenteFactory.componentes = [];

	ComponenteFactory.selectItem = function (componente) {
		this.componente = componente;
		$rootScope.$broadcast('handlerSelectComponente');
	};

	ComponenteFactory.selectItems = function (componentes) {
		this.componentes = componentes;
		$rootScope.$broadcast('handlerSelectComponentes');
	};

	ComponenteFactory.pushItem = function (componente) {
        // Verificar que no existe para evitar elementos duplicados.
        var exist = false;
        angular.forEach(this.componentes, function(item) {
            if(item.id == componente.id) { exist = true; }
        }, this);
        
        if(!exist) {
            this.componentes.push(componente);
            $rootScope.$broadcast('handlerPushComponente');
        }
    }

	return ComponenteFactory;

}]);