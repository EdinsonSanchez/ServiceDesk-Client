/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.factory('AnexosFactory',
	['$rootScope', '$log',
	function ($rootScope, $log) {

	var AnexosFactory = this;

	// Uploader object
	AnexosFactory.uploader = {
		items: [],
		progress: 0
	};

	// set de los items a enviar al servidor(temp)
	AnexosFactory.setItems = function (anexoUploader) {
		// limpiar
		AnexosFactory.clearItems();

		// Asigna los valores necesarios
		AnexosFactory.uploader.progress = anexoUploader.progress;
		angular.forEach(anexoUploader.queue, function(anexo) {

			var item = {};
			item.file = anexo.file;
			item.isUploaded = anexo.isUploaded;
			item.isSuccess = anexo.isSuccess;
			item.progress = anexo.progress;

			AnexosFactory.uploader.items.push(item);
        });

		$rootScope.$broadcast('handlerSetAnexos');
	};

	// Elimina todos los items
	AnexosFactory.clearItems = function () {
		AnexosFactory.uploader.items = [];
		AnexosFactory.uploader.progress = 0;
	};

	return AnexosFactory;

}]);