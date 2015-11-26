/**
 * Service Desk Web Application
 * Gestion de Servicios TI
 *
 * @package ServiceDesk
 *
 * @author Edinson J. Sanchez
 * @copyright Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */
var app = angular.module("SDApp", ['angularMoment', 'ui.router'
	, 'ngRoute', 'ngSanitize'
	, 'ngResource', 'ngCookies'
	, 'ngAnimate', 'checklist-model'
	, 'toaster','datatables'
	, 'angularFileUpload', 'ui.bootstrap'
	, 'timer'
	, 'summernote']);

//var apiMainhost = 'http://www.mss.pe/apps/tickets/v2/public/apiv2';
var sandbox = 'http://localhost\\:8888/sandbox/appGestConfV2.0/public/apiv2';
var sandboxUnport = 'http://localhost:8888/sandbox/appGestConfV2.0/public/apiv2';
//var sandbox = 'http://10.42.0.1/appGestConfV2.0/public/apiv2';

//var apiMainUrl = 'http://www.mss.pe/apps/tickets/v2/public';
//var sandboxurl = 'http://10.42.0.1/appGestConfV2.0/public';
var sandboxurl = 'http://localhost:8888/sandbox/appGestConfV2.0/public';


var apiUrl = sandbox;
var appUrl = sandboxurl;

var appName = 'sandbox/ServiceDesk';

app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
  super: 'super',
  reportes: 'reportes',
  analista: 'analista',
  manager: 'manager',
  usuario: 'usuario',
  none: 'none'
});

app.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', function($stateProvider, $urlRouterProvider, USER_ROLES) {

	// Default Page
	$urlRouterProvider.otherwise('/404');

	$stateProvider
	/*----------------------------------
	 * 404
	 * --------------------------------- */
	.state('404', {
	 	url: '/404',
	 	templateUrl: 'views/errors/404.html'
	})
	 /*----------------------------------
	 * dashboard
	 * --------------------------------- */
	.state('dashboard', {
		url: '/dashboard',
		templateUrl: 'views/home/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super, USER_ROLES.reportes]
	    }
	})
	/*----------------------------------
	 * tickets
	 * --------------------------------- */
	.state('tickets', {
		url: '/tickets',
		templateUrl: 'views/tickets/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super, USER_ROLES.usuario, USER_ROLES.manager, USER_ROLES.analista]
	    }
	})
	.state('tickets-create', {
		url: '/tickets-create',
		templateUrl: 'views/tickets/create.html',
		controller: 'TicketController',
		data: {
	    	authorizedRoles: [USER_ROLES.super, USER_ROLES.usuario, USER_ROLES.manager, USER_ROLES.analista]
	    }
	})
	.state('ticketDetail', {
		url: '/tickets/:id',
		templateUrl: 'views/tickets/edit.html',
		controller: 'TicketDetailController',
		data: {
	    	authorizedRoles: [USER_ROLES.super, USER_ROLES.usuario, USER_ROLES.analista, USER_ROLES.manager]
	    }
	})
	.state('tickets-archivados', {
		url: '/tickets-archivados',
		templateUrl: 'views/tickets/archive.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super, USER_ROLES.analista]
	    }
	})
	/*----------------------------------
	 * tipificaciones
	 * --------------------------------- */
	.state('tipificaciones', {
	 	url: '/tipificaciones',
	 	templateUrl: 'views/tipificaciones/index.html',
	 	data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('tipificaciones-create', {
		url: '/tipificaciones-create',
		templateUrl: 'views/tipificaciones/create.html',
		controller: 'TipificacionController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('tipificacionesDetail', {
		url: '/tipificaciones/:id',
		controller: 'TipificacionDetailController',
		templateUrl: 'views/tipificaciones/edit.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	/*----------------------------------
	 * personas
	 * --------------------------------- */
	.state('personas', {
		url: '/personas',
		templateUrl : 'views/personas/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('personas-create', {
		url: '/personas-create',
		templateUrl : 'views/personas/create.html',
		controller : 'PersonaController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('personasDetail', {
		url: '/personas/:id',
		templateUrl : 'views/personas/edit.html',
		controller: 'PersonaDetailController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	/*----------------------------------
	 * users
	 * --------------------------------- */
	.state('users', {
		url: '/users',
		templateUrl: 'views/users/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('users-create', {
		url: '/users-create',
		controller: 'UserController',
		templateUrl: 'views/users/create.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('usersDetail', {
		url: '/users/:id',
		templateUrl: 'views/users/edit.html',
		controller: 'UserDetailController',
		data: {
	    	authorizedRoles: [USER_ROLES.super, USER_ROLES.usuario, USER_ROLES.analista, USER_ROLES.manager]
	    }
	})
	/*----------------------------------
	 * grupos
	 * --------------------------------- */
	.state('grupos', {
		url: '/grupos',
		templateUrl: 'views/grupos/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('grupos-create', {
		url: '/grupos-create',
		templateUrl: 'views/grupos/create.html',
		controller: 'GrupoController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('gruposDetail', {
		url: '/grupos/:id',
		templateUrl: 'views/grupos/edit.html',
		controller: 'GrupoDetailController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	/*----------------------------------
	 * cargos
	 * --------------------------------- */
	.state('cargos', {
		url: '/cargos',
		templateUrl: 'views/cargos/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('cargos-create', {
		url: '/cargos-create',
		templateUrl: 'views/cargos/create.html',
		controller: 'CargoController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('cargosDetail', {
		url: '/cargos/:id',
		templateUrl: 'views/cargos/edit.html',
		controller: 'CargoDetailController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	/*----------------------------------
	 * areas
	 * --------------------------------- */
	.state('areas', {
		url: '/areas',
		templateUrl: 'views/areas/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('areas-create', {
		url: '/areas-create',
		templateUrl: 'views/areas/create.html',
		controller: 'AreaController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('areasDetail', {
		url: '/areas/:id',
		templateUrl: 'views/areas/edit.html',
		controller: 'AreaDetailController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	/*----------------------------------
	 * usergroups (roles)
	 * --------------------------------- */
	.state('usergroups', {
	 	url: '/usergroups',
		templateUrl: 'views/usergroups/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	 })
	.state('usergroups-create', {
		url: '/usergroups-create',
		templateUrl: 'views/usergroups/create.html',
		controller: 'UsergroupController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('usergroupsDetail', {
		url: '/usergroups/:id',
		templateUrl: 'views/usergroups/edit.html',
		controller: 'UsergroupDetailController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	/*----------------------------------
	 * ics
	 * --------------------------------- */
	.state('elementos', {
		url: '/elementos',
		templateUrl: 'views/elementos/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('elementos-create', {
		url: '/elementos-create',
		controller: 'ElementoController',
		templateUrl: 'views/elementos/create.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('elementosDetail', {
		url: '/elementos/:id',
		templateUrl: 'views/elementos/edit.html',
		controller: 'ElementoDetailController',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	/*----------------------------------
	* empresas
	* --------------------------------- */
	.state('empresas', {
		url: '/empresas',
		templateUrl: 'views/empresas/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('empresas-create', {
		url: '/empresas-create',
		controller: 'EmpresaController as evm',
		templateUrl: 'views/empresas/create.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	.state('empresasDetail', {
		url: '/empresas/:id',
		controller: 'EmpresaDetailController as evm',
		templateUrl: 'views/empresas/edit.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	/*----------------------------------
	* sucursales
	* --------------------------------- */
	.state('sucursales', {
		url: '/sucursales',
		templateUrl: 'views/sucursales/index.html',
		data: {
	    	authorizedRoles: [USER_ROLES.super]
	    }
	})
	.state('sucursales-create', {
		url: '/sucursales-create',
		controller: 'SucursalController as svm',
		templateUrl: 'views/sucursales/create.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	.state('sucursalesDetail', {
		url: '/sucursales/:id',
		controller: 'SucursalDetailController as svm',
		templateUrl: 'views/sucursales/edit.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	/*----------------------------------
	* clases
	* --------------------------------- */
	.state('clases', {
		url: '/clases',
		templateUrl: 'views/clases/index.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	.state('clases-create', {
		url: '/clases-create',
		controller: 'ClaseController as cvm',
		templateUrl: 'views/clases/create.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	.state('clasesDetail', {
		url: '/clases/:id',
		controller: 'ClaseDetailController as cvm',
		templateUrl: 'views/clases/edit.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	/*----------------------------------
	* clases
	* --------------------------------- */
	.state('slas', {
		url: '/slas',
		templateUrl: 'views/slas/index.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	.state('slas-create', {
		url: '/slas-create',
		controller: 'SlaController as svm',
		templateUrl: 'views/slas/create.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	.state('slasDetail', {
		url: '/slas/:id',
		controller: 'SlaDetailController as svm',
		templateUrl: 'views/slas/edit.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	/*----------------------------------
	* ubicaciones
	* --------------------------------- */
	.state('ubicaciones', {
		url: '/ubicaciones',
		templateUrl: 'views/ubicaciones/index.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	.state('ubicaciones-create', {
		url: '/ubicaciones-create',
		controller: 'UbicacionController as uvm',
		templateUrl: 'views/ubicaciones/create.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	})
	.state('ubicacionesDetail', {
		url: '/ubicaciones/:id',
		controller: 'UbicacionDetailController as uvm',
		templateUrl: 'views/ubicaciones/edit.html',
		data: {
			authorizedRoles: [USER_ROLES.super]
		}
	});

	//
}]);

app.run(['$rootScope', 'AUTH_EVENTS', 'AuthService', function ($rootScope, AUTH_EVENTS, AuthService) {
  	$rootScope.$on('$stateChangeStart', function (event, next) {

  		if(next.data) {
  			var authorizedRoles = next.data.authorizedRoles;

	    	if (!AuthService.isAuthorized(authorizedRoles)) {

	      		event.preventDefault();
	      		if (AuthService.isAuthenticated()) {
	        		// user is not allowed
	        		$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
	      		} else {
	        		// user is not logged in
	        		$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
	      		}
	    	}
  		}

  	});
}]);
