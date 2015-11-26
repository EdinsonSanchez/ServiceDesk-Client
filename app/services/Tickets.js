/**
 * @package		ServiceDesk
 * @subpackage	services
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';
// services
app.service('TicketsResource',
	['$resource', function ($resource) {

	return $resource(apiUrl + '/tickets', {}, {
		query: { method: 'GET', isArray: true },
		create: { method: 'POST' }
	});

}]);

app.service('TicketResource',
	['$resource', function ($resource) {

    return $resource(apiUrl + '/tickets/:id', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: { id: '@id' } },
        delete: { method: 'DELETE', params: { id: '@id' } }
    })
}]);


// Interface pass to data controller to controller
app.factory('TicketFactory',
	['$rootScope', '$log', function ($rootScope, $log) {

	var TicketFactory = this;

	TicketFactory.ticket = {};

	TicketFactory.selectItem = function (ticket) {
		this.ticket = ticket;
		$rootScope.$broadcast('handlerSelectTicket');
	};

	return TicketFactory;

}]);
