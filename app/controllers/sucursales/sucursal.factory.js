(function () {
    'use strict';

    angular
        .module('SDApp')
        .factory('SucursalFactory', SucursalFactory);

    SucursalFactory.$inject = ['$rootScope'];

    function SucursalFactory($rootScope) {
        var factory = this;
        factory.sucursal = {};
        factory.sucursales = [];

        factory.selectItem = function (sucursal) {
            this.sucursal = sucursal;
            $rootScope.$broadcast('handlerSelectSucursal');
        }

        factory.selectItems = function (sucursales) {
            this.sucursales = sucursales;
    		$rootScope.$broadcast('handlerSelectSucursales');
        }

        factory.pushItem = function (sucursal) {
            // Verificar que no existe para evitar elementos duplicados.
            var exist = false;
            angular.forEach(this.sucursales, function(item) {
                if(item.id == sucursal.id) { exist = true; }
            }, this);

            if(!exist) {
                this.sucursales.push(sucursal);
                $rootScope.$broadcast('handlerPushSucursal');
            }
        }

        return factory;

    }

})();
