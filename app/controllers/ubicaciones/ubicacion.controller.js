(function () {
	
	'use strict';
	
	angular
		.module('SDApp')
		.controller('UbicacionController', UbicacionController);
		
	UbicacionController.$inject = ['$scope', '$log', '$location', 'UbicacionesResource'];
	
	/**
	 * Manejador de ubicaciones UI.
	*/
	function UbicacionController ($scope, $log, $location, UbicacionesResource) {
		var vm = this;
		vm.ubicacion = {
			nombre: '',
			descripcion: ''
		};
		/* ----------------------------------------------------
		* Observer
		* ---------------------------------------------------- */
		vm.ubicacionObs = {
			uploader: {
				isSuccess: false,
				isError: false,
				isLoading: false,
				message: '',
			}
		};
		vm.newUbicacion = newUbicacion;
		
		/**
		 * Registra ubicacion en el servidor.
		 * 
		 * @param {boolean} isValid
		 * 
		 * @return void
		*/
		function newUbicacion (isValid) {
			if(isValid) {
				// console.log(vm.ubicacion);
				vm.ubicacionObs.uploader.isLoading = true;
		
				UbicacionesResource.create(vm.ubicacion, function (response) {
					vm.ubicacionObs.uploader.isSuccess = true;
					vm.ubicacionObs.uploader.message = response.message;
				}, function (error) {
					if(error.data.message) {
						vm.ubicacionObs.uploader.message = error.data.message;
					} else {
						vm.ubicacionObs.uploader.message = 'Error en el proceso de registro!';
					}
		
					vm.ubicacionObs.uploader.isError = true;
				});
			}
		}
	}
	
})();