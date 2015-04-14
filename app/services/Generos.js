/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.factory('GenerosFactory', function() {

	var generos = [
		{ id: 1, nombre: "Hombre" }
		, { id: 2, nombre: "Mujer" }
	];

	return {
		getGeneros: function () {
			return generos;
		}
	}
});
