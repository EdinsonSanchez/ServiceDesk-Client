// Detalle del porcentaje de tickets creados agrupados por severidad
app.controller('IncidenciaSeveridadCtrl', ['$scope', '$log', 'ChartsResource', function($scope, $log, ChartsResource) {

    $scope.title = 'Porcentaje de Incidencias del año actual (Severidad)';
    $scope.container = '#incidencias-area';

    var init = function () {

        $(function () {

            $.getJSON(sandboxUnport + '/charts?option=severidad', function (data) {

                $($scope.container).highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: 1,//null,
                        plotShadow: true
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y} tickets</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Reportado',
                        data: data
                    }]
                });
            });

        });
    };

    init();

}]);

// Detalle del porcentaje de tickets creados agrupados por clase
app.controller('IncidenciaClaseCtrl', ['$scope', '$log', 'ChartsResource', function($scope, $log, ChartsResource) {

    $scope.title = 'Porcentaje de Incidencias del año actual (Clase)';
    $scope.container = '#incidencias-clase-area';

    var init = function () {

        $(function () {

            $.getJSON(sandboxUnport + '/charts?option=clase', function (data) {

                $($scope.container).highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: 1,//null,
                        plotShadow: true
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y} tickets</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Reportado',
                        data: data
                    }]
                });
            });

        });
    };

    init();

}]);

// Detalle de tickets creados en la semana actual, agrupados por severidad
app.controller('IncidenciaWeekCtrl', ['$scope', '$log', 'ChartsResource', function($scope, $log, ChartsResource) {

    $scope.title = 'Incidencias reportadas en la semana actual';
    $scope.container = '#incidencias-week-area';

    var init = function () {

        $(function () {

            $.getJSON(sandboxUnport + '/charts?option=weekly', function (series) {

                $($scope.container).highcharts({
                    chart: {
                        type: 'areaspline'
                    },
                    title: {
                        text: null
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'top',
                        x: 150,
                        y: 100,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                    },
                    xAxis: {
                        categories: [
                            'Domingo',
                            'Lunes',
                            'Martes',
                            'Miercoles',
                            'Jueves',
                            'Viernes',
                            'Sabado'
                        ]
                    },
                    yAxis: {
                        title: {
                            text: 'Tickets'
                        }
                    },
                    tooltip: {
                        shared: true,
                        valueSuffix: ' tickets'
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        areaspline: {
                            fillOpacity: 0.5
                        }
                    },
                    series: series
                });
            });


        });
    };

    init();

}]);

// Detalle mensual de tickets creados en el anho actual, agrupados por severidad
app.controller('IncidenciaMonthlyCtrl', ['$scope', '$log', 'ChartsResource', function($scope, $log, ChartsResource) {

    $scope.title = 'Incidencias reportadas en el año actual';
    $scope.container = '#incidencias-monthly-area';

    var init = function () {

        $(function () {
            $.getJSON(sandboxUnport + '/charts?option=monthly', function (series) {

                $($scope.container).highcharts({
                    title: {
                        text: null,
                        x: -20 //center
                    },
                    subtitle: {
                        text: null,
                        x: -20
                    },
                    xAxis: {
                        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                    },
                    yAxis: {
                        title: {
                            text: 'Tickets'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ' tickets'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: series
                });

            });


        });
    };

    init();

}]);

// Detalle diario de tickets crados en el ultimo anho
app.controller('IncidenciaDaylyCtrl', ['$scope', '$log', 'ChartsResource', function($scope, $log, ChartsResource) {

    $scope.title = 'Incidencias reportadas en el año actual';
    $scope.container = '#incidencias-dayly-area';
    var date = new Date();

    var init = function () {

        $(function () {
            $.getJSON(sandboxUnport + '/charts?option=dayly', function (data) {

                $($scope.container).highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                                'Arrastra en el área del gráfico para aumentar' :
                                'Pincha en el gráfico para aumentar'
                    },
                    xAxis: {
                        type: 'datetime',
                        minRange: 14 * 24 * 3600000 // fourteen days
                    },
                    yAxis: {
                        title: {
                            text: 'Tickets'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                        type: 'area',
                        name: 'Reportado',
                        pointInterval: 24 * 3600 * 1000,
                        pointStart: Date.UTC(date.getFullYear(), 0, 1),
                        data: data
                        }]
                    });

            });


        });
    };

    init();

}]);
