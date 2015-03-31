'use strict';
/* -------------------------------------------------------------------------
 * Todos los tickets.
 * ------------------------------------------------------------------------- */
app.controller('dtTickets',
    ['$scope', '$log', '$location', '$compile', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', 'TicketFactory', 'AuthService',
    function($scope, $log, $location, $compile, $timeout, DTOptionsBuilder, DTColumnBuilder, TicketFactory, AuthService) {

    $scope.user = AuthService.getUser();

    $scope.reloadData = function () {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(tickets) at: ' + new Date());
    };

    $scope.finished = function () {
        $log.info('Finished at: ' + new Date());
        $scope.reloadData();
    };

    $scope.show = function (id) {
        $location.path('/tickets/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/tickets?userId=' + $scope.user.id + '&option=all&status=all')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {

            // Es necesario corregir el problema con la zona horaria, para tener una unica fecha.
            var now = new Date().getTime();
            var tiempoTranscurrido = 0; // tiempo en milisegundos.
            var ultimoMovLast = 0;
            var ultimoMovStandby = false;
            var msFechaProgramado = 0;
            var empresaId = data.empresa.id;
            // Obtiene el tiempo transcurrido de todos lo mivimientos.
            angular.forEach(data.movimientos, function (movimiento) {

                // movimientoclase_id 1: abierto, 7: en espera
                if(movimiento.movimientoclase_id == 1) {

                    var closedAt = new Date(movimiento.closed_at);
                    var createdAt = new Date(movimiento.created_at);
                    // si existe tiempo de cierre del movimiento, es un movimiento con rango de fechas
                    if(movimiento.closed_at != null) {
                        tiempoTranscurrido += closedAt.getTime() - createdAt.getTime();
                    }
                    // Si no hay fecha de cierre indica que es el ultimo movimiento.
                    else {
                        ultimoMovLast = createdAt.getTime();
                    }
                }
                //  Verificamos el ultimo movimiento en estado de espera.
                else if(movimiento.movimientoclase_id == 7 && movimiento.closed_at == null) {
                    ultimoMovStandby = true;
                    msFechaProgramado = new Date(movimiento.fecha_programado).getTime();
                }

            }, this);

            /* ------------------------------------------------
             * Verificamos la clase del ticket.
             * si existe padre, incurre en SLA, al ser hw o sw.
             * si no existe clase simplente no aplica
             *------------------------------------------------- */
            var clase = 0;
            if(data.clase.parent) {
                if(data.clase.parent.id == 1) {
                    clase = 1; // hardware
                }
                else if(data.clase.parent.id == 2) {
                    clase = 2; // software
                }
            }

            var tiempoResolucion = 0;
            if(clase != 0)
            {
                angular.forEach(data.severidad.incclases, function (incclase) {
                    if(incclase.id == 1 && clase == 1 && empresaId == incclase.pivot.empresa_id) { // hardware siempre
                        tiempoResolucion = incclase.pivot.tiempo_resolucion;
                    } else if(incclase.id == 2 && clase == 2 && empresaId == incclase.pivot.empresa_id) { // software siempre
                        tiempoResolucion = incclase.pivot.tiempo_resolucion;
                    }
                }, this);
            }

            /* -----------------------------------------------------------------------------------------
             * NO MUESTRA BANDAS DE COLOR EN LOS CASOS.
             *
             * 0: clase                 Clase no aplica a SLA.
             * true: ultimoMovStandby   El ticket se encuentra programado no muestra banda de color.
             * 0: tiempoResolucion      Aun no se ha definido el tiempo de resolucion.
             * ----------------------------------------------------------------------------------------- */
            if(clase != 0 && !ultimoMovStandby && tiempoResolucion != 0) {
                var restanteDesdeUltimoMov = now - ultimoMovLast;
                var msTiempoResolucion = tiempoResolucion * 1000 * 60;
                var msTiempoTotalTranscurrido = restanteDesdeUltimoMov + tiempoTranscurrido;

                // Se muestra la banda roja al vencer el tiempo total de resolucion.
                if (msTiempoResolucion - (msTiempoTotalTranscurrido) <= 0) {
                    angular.element(row).context.className = 'danger';
                }
                // Se muestra la banda amarilla al estar dentro del ultimo 30% del tiempo total.
                else if ((msTiempoResolucion - (msTiempoResolucion * 0.3)) <= (msTiempoTotalTranscurrido) && msTiempoTotalTranscurrido > 1 ) {
                    angular.element(row).context.className = 'warning';
                }
            }

            /* ------------------------------------------------------------------------------------------
             * Aplicado solo para los ticket que estan en estado de "ESPERA"
             * ----------------------------------------------------------------------------------------- */
            if(ultimoMovStandby) {
                // $log.info((now < msFechaProgramado));
                if(now < msFechaProgramado) {
                    angular.element(row).context.className = 'warning';
                } else {
                    angular.element(row).context.className = 'danger';
                }
            }

            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    // selecciona un registro y lo envia al servicio
                    TicketFactory.selectItem(aData);
                });
            });
            return nRow;
        });

    $scope.getClassBtn = function (severidad) {
        var classBtn = '';
        switch(severidad) {
            case "1": classBtn = 'btn-danger';
            break;
            case "2": classBtn = 'btn-warning';
            break;
            case "3": classBtn = 'btn-info';
            break;
            case "4": classBtn = 'btn-success';
        }
        return classBtn;
    }

    $scope.dtColumns = [
         DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data) {
                return '<button class="btn ' + $scope.getClassBtn(data.severidad_id) +' btn-sm" ng-click="show(' + data.id + ')">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;';
            }),
        DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn(null).withTitle('Ticket')
            .renderWith(function (data){
                return data.prefijo + '-' + ("0000" + data.correlativo).slice(-5);
            }),
        DTColumnBuilder.newColumn(null).withTitle('Descripción')
            .renderWith(function(data) {
                return data.descripcion.length > 30 ? data.descripcion.substring(0, 60) + '...' : data.descripcion;
            }),
        DTColumnBuilder.newColumn('severidad.nivel').withTitle('Severidad'),
        DTColumnBuilder.newColumn(null).withTitle('Prioridad')
            .renderWith(function (data) {
                return 'Prioridad ' + data.prioridad;
            }),
        DTColumnBuilder.newColumn('clase.nombre').withTitle('Clase'),
        DTColumnBuilder.newColumn('empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('reportado_by').withTitle('Reportado por')
            .renderWith(function (data, type, full, meta) {
                return data.nombre + ' ' + data.apellidos;
            }),
        DTColumnBuilder.newColumn('estado.nombre').withTitle('Estado'),
        DTColumnBuilder.newColumn(null).withTitle('Asignado a')
            .renderWith(function (data) {
                if(data.movimientos[data.movimientos.length - 1].asignado != null) {
                    return data.movimientos[data.movimientos.length - 1].asignado.persona.nombre + ' ' + data.movimientos[data.movimientos.length - 1].asignado.persona.apellidos;
                }
                else return null;
            }),
        DTColumnBuilder.newColumn('created_at').withTitle('Fecra creación'),
        DTColumnBuilder.newColumn(null).withTitle('Ultimo acceso')
            .renderWith(function (data) {
                 return data.movimientos[data.movimientos.length - 1].created_at;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Fecha programado')
            .renderWith(function (data) {
                 return data.movimientos[data.movimientos.length - 1].fecha_programado;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Tiempo restante').notSortable()
           .renderWith(function (data, type, full, meta) {

                var now = new Date().getTime();
                var tiempoTranscurrido = 0; // tiempo en milisegundos.
                var ultimoMovLast = 0;
                var ultimoMovStandby = false;
                var empresaId = data.empresa.id;

                angular.forEach(data.movimientos, function (movimiento) {

                    // movimientoclase_id 1: abierto, 7: en espera
                    if(movimiento.movimientoclase_id == 1) {

                        var closedAt = new Date(movimiento.closed_at);
                        var createdAt = new Date(movimiento.created_at);
                        // si existe tiempo de cierre del movimiento, es un movimiento con rango de fechas
                        if(movimiento.closed_at != null) {
                            tiempoTranscurrido += closedAt.getTime() - createdAt.getTime();
                        }
                        // Si no hay fecha de cierre indica que es el ultimo movimiento.
                        else {
                           // tiempoTranscurrido += now.getTime() - createdAt.getTime();
                            ultimoMovLast = createdAt.getTime();
                        }
                    }
                    //  Verificamos el ultimo movimiento en estado de espera.
                    else if(movimiento.movimientoclase_id == 7 && movimiento.closed_at == null) {
                        ultimoMovStandby = true;
                    }

                }, this);

                /* ------------------------------------------------
                 * Verificamos la clase del ticket.
                 * si existe padre, incurre en SLA, al ser hw o sw.
                 * si no existe clase simplente no aplica
                 *------------------------------------------------- */
                var clase = 0;
                if(data.clase.parent) {
                    if(data.clase.parent.id == 1) {
                        clase = 1; // hardware
                    }
                    else if(data.clase.parent.id == 2) {
                        clase = 2; // software
                    }
                }

                var tiempoResolucion = 0;
                if(clase != 0)
                {
                    angular.forEach(data.severidad.incclases, function (incclase) {
                        if(incclase.id == 1 && clase == 1 && empresaId == incclase.pivot.empresa_id) { // hardware siempre
                            tiempoResolucion = incclase.pivot.tiempo_resolucion;
                        } else if(incclase.id == 2 && clase == 2 && empresaId == incclase.pivot.empresa_id) { // software siempre
                            tiempoResolucion = incclase.pivot.tiempo_resolucion;
                        }
                    }, this);
                }

                if(clase == 0) {
                    return '<span class="label label-success">(No Aplica)</span>';
                }

                if(ultimoMovStandby) {
                    return '<span class="label label-info">...</span>';
                }

                if(tiempoResolucion == 0) {
                    return '<span class="label label-warning">(Tiempo a tratar/no definido)</span>';
                } else {
                    var restanteDesdeUltimoMov = now - ultimoMovLast;
                    var msTiempoResolucion = tiempoResolucion * 1000 * 60;

                    if (msTiempoResolucion - (restanteDesdeUltimoMov + tiempoTranscurrido) > 0) {
                        // finish-callback="callbackTimer.finished()"
                        return '<timer finish-callback="finished()" end-time="' + ((ultimoMovLast + msTiempoResolucion) - tiempoTranscurrido) + '">{{days}} días, {{hours}} horas, {{minutes}} minutos, {{seconds}} segundos.</timer>'
                    } else {
                        return '<span class="label label-danger">0 días, 0 horas, 0 minutos, 0 segundos</span>';
                    }
                }
            }),
    ];


}]);



/* -------------------------------------------------------------------------
 * Ticket con estado Abierto
 * ------------------------------------------------------------------------- */
app.controller('dtTicketsAbiertos',
    ['$scope', '$log', '$location', '$compile', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', 'TicketFactory', 'AuthService',
    function($scope, $log, $location, $compile, $timeout, DTOptionsBuilder, DTColumnBuilder, TicketFactory, AuthService) {

    $scope.user = AuthService.getUser();

    $scope.reloadData = function () {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(tickets) at: ' + new Date());
    };

    $scope.finished = function () {
        $log.info('Finished at: ' + new Date());
        $scope.reloadData();
    };

    $scope.show = function (id) {
        $location.path('/tickets/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/tickets?userId=' + $scope.user.id + '&option=all&status=1')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {

            // Es necesario corregir el problema con la zona horaria, para tener una unica fecha.
            var now = new Date().getTime();
            var tiempoTranscurrido = 0; // tiempo en milisegundos.
            var ultimoMovLast = 0;
            var ultimoMovStandby = false;
            var msFechaProgramado = 0;
            var empresaId = data.empresa.id;
            // Obtiene el tiempo transcurrido de todos lo mivimientos.
            angular.forEach(data.movimientos, function (movimiento) {

                // movimientoclase_id 1: abierto, 7: en espera
                if(movimiento.movimientoclase_id == 1) {

                    var closedAt = new Date(movimiento.closed_at);
                    var createdAt = new Date(movimiento.created_at);
                    // si existe tiempo de cierre del movimiento, es un movimiento con rango de fechas
                    if(movimiento.closed_at != null) {
                        tiempoTranscurrido += closedAt.getTime() - createdAt.getTime();
                    }
                    // Si no hay fecha de cierre indica que es el ultimo movimiento.
                    else {
                        ultimoMovLast = createdAt.getTime();
                    }
                }
                //  Verificamos el ultimo movimiento en estado de espera.
                else if(movimiento.movimientoclase_id == 7 && movimiento.closed_at == null) {
                    ultimoMovStandby = true;
                    msFechaProgramado = new Date(movimiento.fecha_programado).getTime();
                }

            }, this);

            /* ------------------------------------------------
             * Verificamos la clase del ticket.
             * si existe padre, incurre en SLA, al ser hw o sw.
             * si no existe clase simplente no aplica
             *------------------------------------------------- */
            var clase = 0;
            if(data.clase.parent) {
                if(data.clase.parent.id == 1) {
                    clase = 1; // hardware
                }
                else if(data.clase.parent.id == 2) {
                    clase = 2; // software
                }
            }

            var tiempoResolucion = 0;
            if(clase != 0)
            {
                angular.forEach(data.severidad.incclases, function (incclase) {
                    if(incclase.id == 1 && clase == 1 && empresaId == incclase.pivot.empresa_id) { // hardware siempre
                        tiempoResolucion = incclase.pivot.tiempo_resolucion;
                    } else if(incclase.id == 2 && clase == 2 && empresaId == incclase.pivot.empresa_id) { // software siempre
                        tiempoResolucion = incclase.pivot.tiempo_resolucion;
                    }
                }, this);
            }

            /* -----------------------------------------------------------------------------------------
             * NO MUESTRA BANDAS DE COLOR EN LOS CASOS.
             *
             * 0: clase                 Clase no aplica a SLA.
             * true: ultimoMovStandby   El ticket se encuentra programado no muestra banda de color.
             * 0: tiempoResolucion      Aun no se ha definido el tiempo de resolucion.
             * ----------------------------------------------------------------------------------------- */
            if(clase != 0 && !ultimoMovStandby && tiempoResolucion != 0) {

                var restanteDesdeUltimoMov = now - ultimoMovLast;
                var msTiempoResolucion = tiempoResolucion * 1000 * 60;
                var msTiempoTotalTranscurrido = restanteDesdeUltimoMov + tiempoTranscurrido;

                // Se muestra la banda roja al vencer el tiempo total de resolucion.
                if (msTiempoResolucion - (msTiempoTotalTranscurrido) <= 0) {
                    angular.element(row).context.className = 'danger';
                }
                // Se muestra la banda amarilla al estar dentro del ultimo 30% del tiempo total.
                else if ((msTiempoResolucion - (msTiempoResolucion * 0.3)) <= (msTiempoTotalTranscurrido) && msTiempoTotalTranscurrido > 1 ) {
                    angular.element(row).context.className = 'warning';
                }
            }

            /* ------------------------------------------------------------------------------------------
             * Aplicado solo para los ticket que estan en estado de "ESPERA"
             * ----------------------------------------------------------------------------------------- */
            if(ultimoMovStandby) {
                // $log.info((now < msFechaProgramado));
                if(now < msFechaProgramado) {
                    angular.element(row).context.className = 'warning';
                } else {
                    angular.element(row).context.className = 'danger';
                }
            }

            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    // selecciona un registro y lo envia al servicio
                    TicketFactory.selectItem(aData);
                });
            });
            return nRow;
        });

    $scope.getClassBtn = function (severidad) {
        var classBtn = '';
        switch(severidad) {
            case "1": classBtn = 'btn-danger';
            break;
            case "2": classBtn = 'btn-warning';
            break;
            case "3": classBtn = 'btn-info';
            break;
            case "4": classBtn = 'btn-success';
        }
        return classBtn;
    }

    $scope.dtColumns = [
         DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data) {
                return '<button class="btn ' + $scope.getClassBtn(data.severidad_id) +' btn-sm" ng-click="show(' + data.id + ')">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;';
            }),
        DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn(null).withTitle('Ticket')
            .renderWith(function (data){
                return data.prefijo + '-' + ("0000" + data.correlativo).slice(-5);
            }),
        DTColumnBuilder.newColumn(null).withTitle('Descripción')
            .renderWith(function(data) {
                return data.descripcion.length > 30 ? data.descripcion.substring(0, 60) + '...' : data.descripcion;
            }),
        DTColumnBuilder.newColumn('severidad.nivel').withTitle('Severidad'),
        DTColumnBuilder.newColumn(null).withTitle('Prioridad')
            .renderWith(function (data) {
                return 'Prioridad ' + data.prioridad;
            }),
        DTColumnBuilder.newColumn('clase.nombre').withTitle('Clase'),
        DTColumnBuilder.newColumn('empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('reportado_by').withTitle('Reportado por')
            .renderWith(function (data, type, full, meta) {
                return data.nombre + ' ' + data.apellidos;
            }),
        DTColumnBuilder.newColumn(null).withTitle('Asignado a')
            .renderWith(function (data) {
                if(data.movimientos[data.movimientos.length - 1].asignado != null) {
                    return data.movimientos[data.movimientos.length - 1].asignado.persona.nombre + ' ' + data.movimientos[data.movimientos.length - 1].asignado.persona.apellidos;
                }
                else return null;
            }),
        DTColumnBuilder.newColumn('created_at').withTitle('Fecra creación'),
        DTColumnBuilder.newColumn(null).withTitle('Ultimo acceso')
            .renderWith(function (data) {
                 return data.movimientos[data.movimientos.length - 1].created_at;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Tiempo restante').notSortable()
           .renderWith(function (data, type, full, meta) {

                var now = new Date().getTime();
                var tiempoTranscurrido = 0; // tiempo en milisegundos.
                var ultimoMovLast = 0;
                var ultimoMovStandby = false;
                var empresaId = data.empresa.id;

                angular.forEach(data.movimientos, function (movimiento) {

                    // movimientoclase_id 1: abierto, 7: en espera
                    if(movimiento.movimientoclase_id == 1) {

                        var closedAt = new Date(movimiento.closed_at);
                        var createdAt = new Date(movimiento.created_at);
                        // si existe tiempo de cierre del movimiento, es un movimiento con rango de fechas
                        if(movimiento.closed_at != null) {
                            tiempoTranscurrido += closedAt.getTime() - createdAt.getTime();
                        }
                        // Si no hay fecha de cierre indica que es el ultimo movimiento.
                        else {
                           // tiempoTranscurrido += now.getTime() - createdAt.getTime();
                            ultimoMovLast = createdAt.getTime();
                        }
                    }
                    //  Verificamos el ultimo movimiento en estado de espera.
                    else if(movimiento.movimientoclase_id == 7 && movimiento.closed_at == null) {
                        ultimoMovStandby = true;
                    }

                }, this);

                /* ------------------------------------------------
                 * Verificamos la clase del ticket.
                 * si existe padre, incurre en SLA, al ser hw o sw.
                 * si no existe clase simplente no aplica
                 *------------------------------------------------- */
                var clase = 0;
                if(data.clase.parent) {
                    if(data.clase.parent.id == 1) {
                        clase = 1; // hardware
                    }
                    else if(data.clase.parent.id == 2) {
                        clase = 2; // software
                    }
                }

                var tiempoResolucion = 0;
                if(clase != 0)
                {
                    angular.forEach(data.severidad.incclases, function (incclase) {
                        if(incclase.id == 1 && clase == 1 && empresaId == incclase.pivot.empresa_id) { // hardware siempre
                            tiempoResolucion = incclase.pivot.tiempo_resolucion;
                        } else if(incclase.id == 2 && clase == 2 && empresaId == incclase.pivot.empresa_id) { // software siempre
                            tiempoResolucion = incclase.pivot.tiempo_resolucion;
                        }
                    }, this);
                }

                if(clase == 0) {
                    return '<span class="label label-success">(No Aplica)</span>';
                }

                if(ultimoMovStandby) {
                    return '<span class="label label-info">...</span>';
                }

                if(tiempoResolucion == 0) {
                    return '<span class="label label-warning">(Tiempo a tratar/no definido)</span>';
                } else {
                    var restanteDesdeUltimoMov = now - ultimoMovLast;
                    var msTiempoResolucion = tiempoResolucion * 1000 * 60;

                    if (msTiempoResolucion - (restanteDesdeUltimoMov + tiempoTranscurrido) > 0) {
                        // finish-callback="callbackTimer.finished()"
                        return '<timer finish-callback="finished()" end-time="' + ((ultimoMovLast + msTiempoResolucion) - tiempoTranscurrido) + '">{{days}} días, {{hours}} horas, {{minutes}} minutos, {{seconds}} segundos.</timer>'
                    } else {
                        return '<span class="label label-danger">0 días, 0 horas, 0 minutos, 0 segundos</span>';
                    }
                }
            }),
    ];


}]);

/* -------------------------------------------------------------------------
 * Ticket con estado Pendiente por usuario
 * ------------------------------------------------------------------------- */
app.controller('dtTicketsPendientes',
    ['$scope', '$log', '$location', '$compile', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', 'TicketFactory', 'AuthService',
    function($scope, $log, $location, $compile, $timeout, DTOptionsBuilder, DTColumnBuilder, TicketFactory, AuthService) {

    $scope.user = AuthService.getUser();

    $scope.reloadData = function () {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(tickets) at: ' + new Date());
    };

    $scope.finished = function () {
        $log.info('Finished at: ' + new Date());
        $scope.reloadData();
    };

    $scope.show = function (id) {
        $location.path('/tickets/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/tickets?userId=' + $scope.user.id + '&option=all&status=4')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {

            // Es necesario corregir el problema con la zona horaria, para tener una unica fecha.
            var now = new Date().getTime();
            var tiempoTranscurrido = 0; // tiempo en milisegundos.
            var ultimoMovLast = 0;
            var ultimoMovStandby = false;
            var msFechaProgramado = 0;
            var empresaId = data.empresa.id;
            // Obtiene el tiempo transcurrido de todos lo mivimientos.
            angular.forEach(data.movimientos, function (movimiento) {

                // movimientoclase_id 1: abierto, 7: en espera
                if(movimiento.movimientoclase_id == 1) {

                    var closedAt = new Date(movimiento.closed_at);
                    var createdAt = new Date(movimiento.created_at);
                    // si existe tiempo de cierre del movimiento, es un movimiento con rango de fechas
                    if(movimiento.closed_at != null) {
                        tiempoTranscurrido += closedAt.getTime() - createdAt.getTime();
                    }
                    // Si no hay fecha de cierre indica que es el ultimo movimiento.
                    else {
                        ultimoMovLast = createdAt.getTime();
                    }
                }
                //  Verificamos el ultimo movimiento en estado de espera.
                else if(movimiento.movimientoclase_id == 7 && movimiento.closed_at == null) {
                    ultimoMovStandby = true;
                    msFechaProgramado = new Date(movimiento.fecha_programado).getTime();
                }

            }, this);

            /* ------------------------------------------------
             * Verificamos la clase del ticket.
             * si existe padre, incurre en SLA, al ser hw o sw.
             * si no existe clase simplente no aplica
             *------------------------------------------------- */
            var clase = 0;
            if(data.clase.parent) {
                if(data.clase.parent.id == 1) {
                    clase = 1; // hardware
                }
                else if(data.clase.parent.id == 2) {
                    clase = 2; // software
                }
            }

            var tiempoResolucion = 0;
            if(clase != 0)
            {
                angular.forEach(data.severidad.incclases, function (incclase) {
                    if(incclase.id == 1 && clase == 1 && empresaId == incclase.pivot.empresa_id) { // hardware siempre
                        tiempoResolucion = incclase.pivot.tiempo_resolucion;
                    } else if(incclase.id == 2 && clase == 2 && empresaId == incclase.pivot.empresa_id) { // software siempre
                        tiempoResolucion = incclase.pivot.tiempo_resolucion;
                    }
                }, this);
            }

            /* -----------------------------------------------------------------------------------------
             * NO MUESTRA BANDAS DE COLOR EN LOS CASOS.
             *
             * 0: clase                 Clase no aplica a SLA.
             * true: ultimoMovStandby   El ticket se encuentra programado no muestra banda de color.
             * 0: tiempoResolucion      Aun no se ha definido el tiempo de resolucion.
             * ----------------------------------------------------------------------------------------- */
            if(clase != 0 && !ultimoMovStandby && tiempoResolucion != 0) {

                var restanteDesdeUltimoMov = now - ultimoMovLast;
                var msTiempoResolucion = tiempoResolucion * 1000 * 60;
                var msTiempoTotalTranscurrido = restanteDesdeUltimoMov + tiempoTranscurrido;

                // Se muestra la banda roja al vencer el tiempo total de resolucion.
                if (msTiempoResolucion - (msTiempoTotalTranscurrido) <= 0) {
                    angular.element(row).context.className = 'danger';
                }
                // Se muestra la banda amarilla al estar dentro del ultimo 30% del tiempo total.
                else if ((msTiempoResolucion - (msTiempoResolucion * 0.3)) <= (msTiempoTotalTranscurrido) && msTiempoTotalTranscurrido > 1 ) {
                    angular.element(row).context.className = 'warning';
                }
            }

            /* ------------------------------------------------------------------------------------------
             * Aplicado solo para los ticket que estan en estado de "ESPERA"
             * ----------------------------------------------------------------------------------------- */
            if(ultimoMovStandby) {
                // $log.info((now < msFechaProgramado));
                if(now < msFechaProgramado) {
                    angular.element(row).context.className = 'warning';
                } else {
                    angular.element(row).context.className = 'danger';
                }
            }

            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    // selecciona un registro y lo envia al servicio
                    TicketFactory.selectItem(aData);
                });
            });
            return nRow;
        });

    $scope.getClassBtn = function (severidad) {
        var classBtn = '';
        switch(severidad) {
            case "1": classBtn = 'btn-danger';
            break;
            case "2": classBtn = 'btn-warning';
            break;
            case "3": classBtn = 'btn-info';
            break;
            case "4": classBtn = 'btn-success';
        }
        return classBtn;
    }

    $scope.dtColumns = [
         DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data) {
                return '<button class="btn ' + $scope.getClassBtn(data.severidad_id) +' btn-sm" ng-click="show(' + data.id + ')">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;';
            }),
        DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn(null).withTitle('Ticket')
            .renderWith(function (data){
                return data.prefijo + '-' + ("0000" + data.correlativo).slice(-5);
            }),
        DTColumnBuilder.newColumn(null).withTitle('Descripción')
            .renderWith(function(data) {
                return data.descripcion.length > 30 ? data.descripcion.substring(0, 60) + '...' : data.descripcion;
            }),
        DTColumnBuilder.newColumn('severidad.nivel').withTitle('Severidad'),
        DTColumnBuilder.newColumn(null).withTitle('Prioridad')
            .renderWith(function (data) {
                return 'Prioridad ' + data.prioridad;
            }),
        DTColumnBuilder.newColumn('clase.nombre').withTitle('Clase'),
        DTColumnBuilder.newColumn('empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('reportado_by').withTitle('Reportado por')
            .renderWith(function (data, type, full, meta) {
                return data.nombre + ' ' + data.apellidos;
            }),
        DTColumnBuilder.newColumn(null).withTitle('Asignado a')
            .renderWith(function (data) {
                if(data.movimientos[data.movimientos.length - 1].asignado != null) {
                    return data.movimientos[data.movimientos.length - 1].asignado.persona.nombre + ' ' + data.movimientos[data.movimientos.length - 1].asignado.persona.apellidos;
                }
                else return null;
            }),
        DTColumnBuilder.newColumn('created_at').withTitle('Fecra creación'),
        DTColumnBuilder.newColumn(null).withTitle('Ultimo acceso')
            .renderWith(function (data) {
                 return data.movimientos[data.movimientos.length - 1].created_at;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Tiempo restante').notSortable()
           .renderWith(function (data, type, full, meta) {

                var now = new Date().getTime();
                var tiempoTranscurrido = 0; // tiempo en milisegundos.
                var ultimoMovLast = 0;
                var ultimoMovStandby = false;
                var empresaId = data.empresa.id;

                angular.forEach(data.movimientos, function (movimiento) {

                    // movimientoclase_id 1: abierto, 7: en espera
                    if(movimiento.movimientoclase_id == 1) {

                        var closedAt = new Date(movimiento.closed_at);
                        var createdAt = new Date(movimiento.created_at);
                        // si existe tiempo de cierre del movimiento, es un movimiento con rango de fechas
                        if(movimiento.closed_at != null) {
                            tiempoTranscurrido += closedAt.getTime() - createdAt.getTime();
                        }
                        // Si no hay fecha de cierre indica que es el ultimo movimiento.
                        else {
                           // tiempoTranscurrido += now.getTime() - createdAt.getTime();
                            ultimoMovLast = createdAt.getTime();
                        }
                    }
                    //  Verificamos el ultimo movimiento en estado de espera.
                    else if(movimiento.movimientoclase_id == 7 && movimiento.closed_at == null) {
                        ultimoMovStandby = true;
                    }

                }, this);

                /* ------------------------------------------------
                 * Verificamos la clase del ticket.
                 * si existe padre, incurre en SLA, al ser hw o sw.
                 * si no existe clase simplente no aplica
                 *------------------------------------------------- */
                var clase = 0;
                if(data.clase.parent) {
                    if(data.clase.parent.id == 1) {
                        clase = 1; // hardware
                    }
                    else if(data.clase.parent.id == 2) {
                        clase = 2; // software
                    }
                }

                var tiempoResolucion = 0;
                if(clase != 0)
                {
                    angular.forEach(data.severidad.incclases, function (incclase) {
                        if(incclase.id == 1 && clase == 1 && empresaId == incclase.pivot.empresa_id) { // hardware siempre
                            tiempoResolucion = incclase.pivot.tiempo_resolucion;
                        } else if(incclase.id == 2 && clase == 2 && empresaId == incclase.pivot.empresa_id) { // software siempre
                            tiempoResolucion = incclase.pivot.tiempo_resolucion;
                        }
                    }, this);
                }

                if(clase == 0) {
                    return '<span class="label label-success">(No Aplica)</span>';
                }

                if(ultimoMovStandby) {
                    return '<span class="label label-info">...</span>';
                }

                if(tiempoResolucion == 0) {
                    return '<span class="label label-warning">(Tiempo a tratar/no definido)</span>';
                } else {
                    var restanteDesdeUltimoMov = now - ultimoMovLast;
                    var msTiempoResolucion = tiempoResolucion * 1000 * 60;

                    if (msTiempoResolucion - (restanteDesdeUltimoMov + tiempoTranscurrido) > 0) {
                        // finish-callback="callbackTimer.finished()"
                        return '<timer finish-callback="finished()" end-time="' + ((ultimoMovLast + msTiempoResolucion) - tiempoTranscurrido) + '">{{days}} días, {{hours}} horas, {{minutes}} minutos, {{seconds}} segundos.</timer>'
                    } else {
                        return '<span class="label label-danger">0 días, 0 horas, 0 minutos, 0 segundos</span>';
                    }
                }
            }),
    ];


}]);

/* -------------------------------------------------------------------------
 * Ticket con estado Programado
 * ------------------------------------------------------------------------- */
app.controller('dtTicketsEspera',
    ['$scope', '$log', '$location', '$compile', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', 'TicketFactory', 'AuthService',
    function($scope, $log, $location, $compile, $timeout, DTOptionsBuilder, DTColumnBuilder, TicketFactory, AuthService) {

    $scope.user = AuthService.getUser();

    $scope.reloadData = function () {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(tickets) at: ' + new Date());
    };

    $scope.finished = function () {
        $log.info('Finished at: ' + new Date());
        $scope.reloadData();
    };

    $scope.show = function (id) {
        $location.path('/tickets/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/tickets?userId=' + $scope.user.id + '&option=all&status=7')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {

            // Es necesario corregir el problema con la zona horaria, para tener una unica fecha.
            var now = new Date().getTime();
            var tiempoTranscurrido = 0; // tiempo en milisegundos.
            var ultimoMovLast = 0;
            var ultimoMovStandby = false;
            var msFechaProgramado = 0;
            var empresaId = data.empresa.id;
            // Obtiene el tiempo transcurrido de todos lo mivimientos.
            angular.forEach(data.movimientos, function (movimiento) {

                // movimientoclase_id 1: abierto, 7: en espera
                if(movimiento.movimientoclase_id == 1) {

                    var closedAt = new Date(movimiento.closed_at);
                    var createdAt = new Date(movimiento.created_at);
                    // si existe tiempo de cierre del movimiento, es un movimiento con rango de fechas
                    if(movimiento.closed_at != null) {
                        tiempoTranscurrido += closedAt.getTime() - createdAt.getTime();
                    }
                    // Si no hay fecha de cierre indica que es el ultimo movimiento.
                    else {
                        ultimoMovLast = createdAt.getTime();
                    }
                }
                //  Verificamos el ultimo movimiento en estado de espera.
                else if(movimiento.movimientoclase_id == 7 && movimiento.closed_at == null) {
                    ultimoMovStandby = true;
                    msFechaProgramado = new Date(movimiento.fecha_programado).getTime();
                }

            }, this);

            /* ------------------------------------------------
             * Verificamos la clase del ticket.
             * si existe padre, incurre en SLA, al ser hw o sw.
             * si no existe clase simplente no aplica
             *------------------------------------------------- */
            var clase = 0;
            if(data.clase.parent) {
                if(data.clase.parent.id == 1) {
                    clase = 1; // hardware
                }
                else if(data.clase.parent.id == 2) {
                    clase = 2; // software
                }
            }

            var tiempoResolucion = 0;
            if(clase != 0)
            {
                angular.forEach(data.severidad.incclases, function (incclase) {
                    if(incclase.id == 1 && clase == 1 && empresaId == incclase.pivot.empresa_id) { // hardware siempre
                        tiempoResolucion = incclase.pivot.tiempo_resolucion;
                    } else if(incclase.id == 2 && clase == 2 && empresaId == incclase.pivot.empresa_id) { // software siempre
                        tiempoResolucion = incclase.pivot.tiempo_resolucion;
                    }
                }, this);
            }

            /* -----------------------------------------------------------------------------------------
             * NO MUESTRA BANDAS DE COLOR EN LOS CASOS.
             *
             * 0: clase                 Clase no aplica a SLA.
             * true: ultimoMovStandby   El ticket se encuentra programado no muestra banda de color.
             * 0: tiempoResolucion      Aun no se ha definido el tiempo de resolucion.
             * ----------------------------------------------------------------------------------------- */
            if(clase != 0 && !ultimoMovStandby && tiempoResolucion != 0) {

                var restanteDesdeUltimoMov = now - ultimoMovLast;
                var msTiempoResolucion = tiempoResolucion * 1000 * 60;
                var msTiempoTotalTranscurrido = restanteDesdeUltimoMov + tiempoTranscurrido;

                // Se muestra la banda roja al vencer el tiempo total de resolucion.
                if (msTiempoResolucion - (msTiempoTotalTranscurrido) <= 0) {
                    angular.element(row).context.className = 'danger';
                }
                // Se muestra la banda amarilla al estar dentro del ultimo 30% del tiempo total.
                else if ((msTiempoResolucion - (msTiempoResolucion * 0.3)) <= (msTiempoTotalTranscurrido) && msTiempoTotalTranscurrido > 1 ) {
                    angular.element(row).context.className = 'warning';
                }
            }

            /* ------------------------------------------------------------------------------------------
             * Aplicado solo para los ticket que estan en estado de "ESPERA"
             * ----------------------------------------------------------------------------------------- */
            if(ultimoMovStandby) {
                // $log.info((now < msFechaProgramado));
                if(now < msFechaProgramado) {
                    angular.element(row).context.className = 'warning';
                } else {
                    angular.element(row).context.className = 'danger';
                }
            }

            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    // selecciona un registro y lo envia al servicio
                    TicketFactory.selectItem(aData);
                });
            });
            return nRow;
        });

    $scope.getClassBtn = function (severidad) {
        var classBtn = '';
        switch(severidad) {
            case "1": classBtn = 'btn-danger';
            break;
            case "2": classBtn = 'btn-warning';
            break;
            case "3": classBtn = 'btn-info';
            break;
            case "4": classBtn = 'btn-success';
        }
        return classBtn;
    }

    $scope.dtColumns = [
         DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data) {
                return '<button class="btn ' + $scope.getClassBtn(data.severidad_id) +' btn-sm" ng-click="show(' + data.id + ')">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;';
            }),
        DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn(null).withTitle('Ticket')
            .renderWith(function (data){
                return data.prefijo + '-' + ("0000" + data.correlativo).slice(-5);
            }),
        DTColumnBuilder.newColumn(null).withTitle('Descripción')
            .renderWith(function(data) {
                return data.descripcion.length > 30 ? data.descripcion.substring(0, 60) + '...' : data.descripcion;
            }),
        DTColumnBuilder.newColumn('severidad.nivel').withTitle('Severidad'),
        DTColumnBuilder.newColumn(null).withTitle('Prioridad')
            .renderWith(function (data) {
                return 'Prioridad ' + data.prioridad;
            }),
        DTColumnBuilder.newColumn('clase.nombre').withTitle('Clase'),
        DTColumnBuilder.newColumn('empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('reportado_by').withTitle('Reportado por')
            .renderWith(function (data, type, full, meta) {
                return data.nombre + ' ' + data.apellidos;
            }),
        DTColumnBuilder.newColumn(null).withTitle('Asignado a')
            .renderWith(function (data) {
                if(data.movimientos[data.movimientos.length - 1].asignado != null) {
                    return data.movimientos[data.movimientos.length - 1].asignado.persona.nombre + ' ' + data.movimientos[data.movimientos.length - 1].asignado.persona.apellidos;
                }
                else return null;
            }),
        DTColumnBuilder.newColumn('created_at').withTitle('Fecra creación'),
        DTColumnBuilder.newColumn(null).withTitle('Ultimo acceso')
            .renderWith(function (data) {
                 return data.movimientos[data.movimientos.length - 1].created_at;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Fecha programado')
            .renderWith(function (data) {
                 return data.movimientos[data.movimientos.length - 1].fecha_programado;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Tiempo restante').notSortable()
           .renderWith(function (data, type, full, meta) {

                var now = new Date().getTime();
                var tiempoTranscurrido = 0; // tiempo en milisegundos.
                var ultimoMovLast = 0;
                var ultimoMovStandby = false;
                var empresaId = data.empresa.id;
                angular.forEach(data.movimientos, function (movimiento) {

                    // movimientoclase_id 1: abierto, 7: en espera
                    if(movimiento.movimientoclase_id == 1) {

                        var closedAt = new Date(movimiento.closed_at);
                        var createdAt = new Date(movimiento.created_at);
                        // si existe tiempo de cierre del movimiento, es un movimiento con rango de fechas
                        if(movimiento.closed_at != null) {
                            tiempoTranscurrido += closedAt.getTime() - createdAt.getTime();
                        }
                        // Si no hay fecha de cierre indica que es el ultimo movimiento.
                        else {
                           // tiempoTranscurrido += now.getTime() - createdAt.getTime();
                            ultimoMovLast = createdAt.getTime();
                        }
                    }
                    //  Verificamos el ultimo movimiento en estado de espera.
                    else if(movimiento.movimientoclase_id == 7 && movimiento.closed_at == null) {
                        ultimoMovStandby = true;
                    }

                }, this);

                /* ------------------------------------------------
                 * Verificamos la clase del ticket.
                 * si existe padre, incurre en SLA, al ser hw o sw.
                 * si no existe clase simplente no aplica
                 *------------------------------------------------- */
                var clase = 0;
                if(data.clase.parent) {
                    if(data.clase.parent.id == 1) {
                        clase = 1; // hardware
                    }
                    else if(data.clase.parent.id == 2) {
                        clase = 2; // software
                    }
                }

                var tiempoResolucion = 0;
                if(clase != 0)
                {
                    angular.forEach(data.severidad.incclases, function (incclase) {
                        if(incclase.id == 1 && clase == 1 && empresaId == incclase.pivot.empresa_id) { // hardware siempre
                            tiempoResolucion = incclase.pivot.tiempo_resolucion;
                        } else if(incclase.id == 2 && clase == 2 && empresaId == incclase.pivot.empresa_id) { // software siempre
                            tiempoResolucion = incclase.pivot.tiempo_resolucion;
                        }
                    }, this);
                }

                if(clase == 0) {
                    return '<span class="label label-success">(No Aplica)</span>';
                }

                if(ultimoMovStandby) {
                    return '<span class="label label-info">...</span>';
                }

                if(tiempoResolucion == 0) {
                    return '<span class="label label-warning">(Tiempo a tratar/no definido)</span>';
                } else {
                    var restanteDesdeUltimoMov = now - ultimoMovLast;
                    var msTiempoResolucion = tiempoResolucion * 1000 * 60;

                    if (msTiempoResolucion - (restanteDesdeUltimoMov + tiempoTranscurrido) > 0) {
                        // finish-callback="callbackTimer.finished()"
                        return '<timer finish-callback="finished()" end-time="' + ((ultimoMovLast + msTiempoResolucion) - tiempoTranscurrido) + '">{{days}} días, {{hours}} horas, {{minutes}} minutos, {{seconds}} segundos.</timer>'
                    } else {
                        return '<span class="label label-danger">0 días, 0 horas, 0 minutos, 0 segundos</span>';
                    }
                }
            }),
    ];


}]);
