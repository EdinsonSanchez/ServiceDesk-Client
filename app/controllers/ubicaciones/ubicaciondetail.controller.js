(function () {
	'use strict';

	angular
		.module('SDApp')
		.controller('UbicacionDetailController', UbicacionDetailController);

	UbicacionDetailController.$inject = ['$scope', '$stateParams', '$log', '$location', 'UbicacionResource'];

	function UbicacionDetailController($scope, $stateParams, $log, $location, UbicacionResource) {
		var vm = this;
		vm.ubicacion = {
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
		vm.updateUbicacion = updateUbicacion;

		getCurrent();

		function getCurrent() {
			UbicacionResource.show({ id: $stateParams.id }, function (currentUbicacion) {
				vm.ubicacion = currentUbicacion;
				console.log(vm.ubicacion);
			}, function (error) {
				$location.url('/404');
			});
		}

		function updateUbicacion(isValid) {
			if (isValid) {
				// Bloque el boton hasta recibir respuesta del servidor.
				vm.ubicacionObs.uploader.isLoading = true;

				UbicacionResource.update(vm.ubicacion, function (response) {
					vm.ubicacionObs.uploader.isSuccess = true;
					vm.ubicacionObs.uploader.message = response.message;
				}, function (error) {
					if (error.data.message) {
						vm.ubicacionObs.uploader.message = error.data.message;
					} else {
						vm.ubicacionObs.uploader.message = 'Ocurrio un problema al actualizar la información!';
					}

					vm.ubicacionObs.uploader.isError = true;
				});
			}
		}
	}

})();