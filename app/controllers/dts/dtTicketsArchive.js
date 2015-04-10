'use strict';
app.controller('dtTicketsArchive',
    ['$scope', '$log', '$location', '$compile', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', 'AuthService',
    function($scope, $log, $location, $compile, $timeout, DTOptionsBuilder, DTColumnBuilder, AuthService) {

    $scope.user = AuthService.getUser();

    $scope.reloadData = function () {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(tickets) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/tickets/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/tickets?userId=' + $scope.user.id + '&option=archive')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {

            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        });


    $scope.getClassBtn = function (severidad) {
        var classBtn = '';
        switch(severidad) {
            case 1: classBtn = 'btn-danger';
            break;
            case 2: classBtn = 'btn-warning';
            break;
            case 3: classBtn = 'btn-info';
            break;
            case 4: classBtn = 'btn-success';
        }
        return classBtn;
    }

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data) {
                return '<button class="btn btn-sm" ng-click="show(' + data.id + ')">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;';
            }),
        DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn(null).withTitle('Ticket')
            .renderWith(function (data){
                return data.prefijo + '-' + ("0000" + data.correlativo).slice(-5);
            }),
        DTColumnBuilder.newColumn(null).withTitle('Asunto')
            .renderWith(function(data) {
                return data.asunto.length > 30 ? data.asunto.substring(0, 60) + '...' : data.asunto;
            }),
        DTColumnBuilder.newColumn('severidad.nivel').withTitle('Severidad'),
        DTColumnBuilder.newColumn(null).withTitle('Prioridad')
            .renderWith(function (data) {
                return 'Prioridad ' + data.prioridad;
            }),
        DTColumnBuilder.newColumn('clase.nombre').withTitle('Clase'),
        DTColumnBuilder.newColumn('empresa_afectado.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('estado.nombre').withTitle('Estado'),
        DTColumnBuilder.newColumn(null).withTitle('Grupo')
            .renderWith(function (data) {
                if(data.movimientos[data.movimientos.length - 1].grupo != null) {
                    return data.movimientos[data.movimientos.length - 1].grupo.nombre;
                }
                else return null;
            }),
        DTColumnBuilder.newColumn(null).withTitle('Asignado a')
            .renderWith(function (data) {
                if(data.movimientos[data.movimientos.length - 1].asignado != null) {
                    return data.movimientos[data.movimientos.length - 1].asignado.persona.nombre + ' ' + data.movimientos[data.movimientos.length - 1].asignado.persona.apellidos;
                }
                else return null;
            }),
        DTColumnBuilder.newColumn(null).withTitle('Referencia')
            .renderWith(function (data) {
                 if(data.parent != null) {
                     return '<a href="#/tickets/' + data.parent.id +'">' + data.parent.prefijo + '-' + ("0000" + data.parent.correlativo).slice(-5) + '</a>';
                 }
                 else return null;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Solucionado en').notSortable()
           .renderWith(function (data, type, full, meta) {

                var now = new Date().getTime();
                var tiempoTranscurrido = 0; // tiempo en milisegundos.
                var ultimoMovLast = 0;
                var ultimoMovStandby = false;
                var empresaId = data.empresa_afectado.id;
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
                    var msTiempoResolucion = tiempoResolucion * 1000 * 60;

                    if(tiempoTranscurrido < msTiempoResolucion) {
                        return '<span class="label label-success">' + (tiempoTranscurrido / 1000 / 60)+ ' min de ' + tiempoResolucion +' min </span>';
                    }
                    else {
                        return '<span class="label label-danger">' + (tiempoTranscurrido / 1000 / 60) + ' min de ' + tiempoResolucion +' min </span>';
                    }
                }
            }),
    ];

}]);
