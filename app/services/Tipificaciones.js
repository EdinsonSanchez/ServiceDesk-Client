/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.factory('TipificacionesResource', ['$resource', function ($resource) {
	return $resource(apiUrl + '/tipificaciones', {}, {
		query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
	});
}]);

app.factory('TipificacionResource', ['$resource', function ($resource) {
	return $resource(apiUrl + '/tipificaciones/:id', {}, {
		show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
	});
}]);

// Interfaz Tipificacion Factory utilizada para compartir tipificacion entre controladores
app.factory('ITipificacionFactory', ['$rootScope', '$log', function ($rootScope, $log) {
    
    var ITipificacionFactory = this;
    
    ITipificacionFactory.tipificacion = {};
    ITipificacionFactory.tipificaciones = [];
    
    // Selecciona un solo item.
    ITipificacionFactory.selectItem = function (tipificacion) {
        this.tipificacion = tipificacion;
        $rootScope.$broadcast('handlerSelectTipificacion');
    }
    
    // Selecciona una lista de items.
    ITipificacionFactory.selectItems = function (tipificaciones) {
        this.tipificaciones = tipificaciones;
        $rootScope.$broadcast('handlerSelectTipificaciones');
    }
    
    ITipificacionFactory.pushItem = function (tipificacion) {
        // Verificar que no existe para evitar elementos duplicados.
        var exist = false;
        angular.forEach(this.tipificaciones, function(item) {
            if(item.id == tipificacion.id) { exist = true; }
        }, this);
        
        if(!exist) {
            this.tipificaciones.push(tipificacion);
            $rootScope.$broadcast('handlerPushTipificacion');
        }
    }
    
    return ITipificacionFactory;
}]);